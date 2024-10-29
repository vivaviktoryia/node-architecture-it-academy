const dotenv = require('dotenv');
const express = require('express');
const { check, validationResult } = require('express-validator');
const axios = require('axios');
const path = require('path');

dotenv.config({ path: `${__dirname}/config.env` });

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const webserver = express();
const port = process.env.PORT || 7181;

const customCors = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
};

webserver.use(customCors);

webserver.set('view engine', 'pug');
webserver.set('views', path.join(__dirname, 'views'));

// Request Body Parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json -> JSON.parse(req.body)
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded
// webserver.use(express.text()); // content-type: text/plain

webserver.use(loggerMiddleware);

webserver.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.post(
	'/request',
	[
		check('url')
			.trim()
			.isString()
			.notEmpty()
			.withMessage('A URL is required.')
			.matches(
				/^(https?:\/\/)([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/,
			)
			.withMessage(
				'URL should start with http:// or https:// and contain only valid symbols.',
			),
		check('method')
			.customSanitizer((value) => value.toUpperCase())
			.trim()
			.isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
			.withMessage('A valid HTTP method is required.'),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				status: 400,
				statusText: 'Bad request',
				data: null,
				error: {
					message: 'Validation failed',
					details: errors.array().map((err) => ({
						field: err.param,
						message: err.msg,
					})),
				},
			});
		}

		const { url, method, headers = {}, body } = req.body;

		try {
			const response = await axios({
				method,
				url,
				headers,
				data: method === 'GET' ? undefined : body || {},
				maxRedirects: 0,
				timeout: 1000,
				validateStatus: (status) => status < 500,
			});

			res.status(200).json({
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				data: response.data || null,
				error: null,
			});
		} catch (error) {
			let status = 500;
			let statusText = 'Internal server error';
			let errorData = null;

			if (error.response) {
				status = error.response.status;
				statusText = error.response.statusText || 'Request failed';
				errorData = error.response.data;
			} else if (error.request) {
				status = 502;
				statusText = 'Bad Gateway - Unable to reach the target server';
			} else {
				console.error('Error Message:', error.message);
			}

			res.status(status).json({
				status,
				statusText,
				data: null,
				error: {
					message: error.message,
					details: errorData,
				},
			});
		}
	},
);

webserver.get('/', (req, res) => {
	res.render('request');
});

// 404 error
webserver.all('*', (req, res, next) => {
	const errorMsg = `Can't find ${req.originalUrl} on this server!`;
	res.status(404).send(errorMsg);
});

webserver.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	// console.log(process.env.NODE_ENV);
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});
