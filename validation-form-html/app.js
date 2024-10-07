const express = require('express');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const xss = require('xss-clean'); // Data sanitization - XSS

const {
	removeHtml,
	renderHtml,
	composeForm,
	composeSuccess,
} = require('./utils/htmlUtils');
const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const webserver = express();

// html
const pageFilePath = path.join(__dirname, 'public', 'form.html');
webserver.use(express.static(path.join(__dirname, 'public')));

const port = 7181 || 7180;

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

webserver.use(loggerMiddleware);

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.get('/', async (req, res, next) => {
	const formReplacements = {
		'#TITLE': 'Form Page',
		'#CONTENT': composeForm({}, null),
	};

	try {
		const html = await renderHtml(formReplacements, pageFilePath);
		res.send(html);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

webserver.post(
	'/submit',
	[
		check('name')
			.trim()
			.notEmpty()
			.withMessage('Name is required')
			.isLength({ min: 2, max: 50 })
			.withMessage('Name should be between 2 and 50 characters')
			.matches(/^[A-Za-z\s]+$/)
			.withMessage('Name can only contain letters and spaces'),

		check('email')
			.isEmail()
			.withMessage('Invalid email address')
			.notEmpty()
			.withMessage('Email is required')
			.normalizeEmail()
			.isLength({ min: 5, max: 50 })
			.withMessage('Email should be between 5 and 50 characters'),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {

			const formReplacements = {
				'#TITLE': 'Form Page',
				'#CONTENT': composeForm(req.body, errors),
			};
			const html = await renderHtml(formReplacements, pageFilePath);
			return res.status(400).send(html);
		}

		const successReplacements = {
			'#TITLE': 'Form Result',
			'#CONTENT': composeSuccess(req.body),
		};

		try {
			const resultPageHtml = await renderHtml(
				successReplacements,
				pageFilePath,
			);
			res.send(resultPageHtml);
		} catch (error) {
			res.status(500).send('Internal Server Error');
		}
	},
);

// CUSTOM GENERATED VALIDATION
// GET
// webserver.get('/', async (req, res) => {
// 	res.send(composeForm({}, null));
// });

// // POST
// webserver.post('/submit', async (req, res) => {
// 	const sanitizedBody = {
// 		name: removeHtml(req.body.name || ''),
// 		email: removeHtml(req.body.email || ''),
// 	};
// 	const errs = [];

// 	if (!sanitizedBody.name) {
// 		errs.push({
// 			value: sanitizedBody.name || '',
// 			msg: 'Name is required',
// 			path: 'name',
// 		});
// 	}
// 	if (!sanitizedBody.email) {
// 		errs.push({
// 			value: sanitizedBody.email || '',
// 			msg: 'Email is required',
// 			path: 'email',
// 		});
// 	}
// 	if (errs.length > 0) {
// 		res.status(400).send(composeForm(sanitizedBody, errs));
// 	} else {
// 		res.send(composeSuccess(sanitizedBody));
// 	}
// });

// 404 ERROR
webserver.all('*', async (req, res, next) => {
	const statusCode = 404;
	const errorMessage = `Can't find ${req.originalUrl} on this server!`;

	const replacements = {
		'#TITLE': `Error ${statusCode}`,
		'#CONTENT': `
            <div class="error">
                <h2 class="error__title">Uh oh! Something Went Wrong!</h2>
                <div class="error__emoji">😢 🤯</div>
                <p class="error__msg">${statusCode}: ${errorMessage}</p>
            </div>
        `,
	};

	try {
		const html = await renderHtml(replacements, pageFilePath);
		res.status(statusCode).send(html);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

webserver.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});
