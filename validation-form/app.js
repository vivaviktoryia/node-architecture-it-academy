const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator');
const xss = require('xss-clean'); // Data sanitization - XSS

dotenv.config({path: `${__dirname}/config.env`})

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const webserver = express();
const port = process.env.PORT || 7180;

webserver.set('view engine', 'pug');
webserver.set('views', path.join(__dirname, 'views'));

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

webserver.use(loggerMiddleware);
webserver.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.get('/', (req, res, next) => {
	res.render('form', { title: 'Form Page' });
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
			.withMessage('Email  should be between 5 and 50 characters'),
	],
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render('form', {
				error: errors
					.array()
					.map((err) => err.msg)
					.join(', '),
				name: req.query.name || '',
				email: req.query.email || '',
			});
		}

		const { name, email } = req.query;
		res.render('result', { name, email, title: 'Form Result' });
	},
);

// 404 error
webserver.all('*', (req, res, next) => {
	const message = `Can't find ${req.originalUrl} on this server!`;
	res.status(404).render('error', { message, statusCode: 404 });
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
