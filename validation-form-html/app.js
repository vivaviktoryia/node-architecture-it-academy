const express = require('express');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const xss = require('xss-clean'); // Data sanitization - XSS

const { renderHtml } = require('./utils/renderHtml');
const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

// html
// const pageFilePath = path.join(__dirname, 'public', 'index.html');
// const errorFilePath = path.join(__dirname, 'public', 'error.html');
// const formPagePath = path.join(__dirname, 'public', 'form.html');
// const resultPagePath = path.join(__dirname, 'public', 'result.html');

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
	const errorMessage = req.query.error
		? `<p style="color: red;">${req.query.error}</p>`
		: '';
	const nameValue = req.query.name || '';
	const emailValue = req.query.email || '';

	const replacements = {
		'#TITLE': 'Form Page',
		'#CONTENT': `
		    <h1>Please Fill Out the Form</h1>
            <div class="form-container">
                ${errorMessage}
                <form method="get" action="/submit">
                    <label for="name">Name:</label>
                    <input type="text" name="name" value="${nameValue}">
                    <br>
                    <label for="email">Email:</label>
                    <input type="email" name="email" value="${emailValue}">
                    <br>
                    <input type="submit" value="Submit">
                </form>
            </div>
        `,
	};

	try {
		const html = await renderHtml(replacements, pageFilePath);
		res.send(html);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

webserver.get(
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
			const errorMessages = errors
				.array()
				.map((err) => err.msg)
				.join(', ');

			return res.redirect(
				`/?name=${req.query.name}&email=${
					req.query.email
				}&error=${encodeURIComponent(errorMessages)}`,
			);
		}

		const { name, email } = req.query;

		const replacements = {
			'#TITLE': 'Form Result',
			'#CONTENT': `
        <h1>Form Submitted Successfully!</h1>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <a href="/">Go Back to Form</a>
      `,
		};

		try {
			const resultPageHtml = await renderHtml(replacements, pageFilePath);
			res.send(resultPageHtml);
		} catch (error) {
			res.status(500).send('Internal Server Error');
		}
	},
);

// 404 error
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
