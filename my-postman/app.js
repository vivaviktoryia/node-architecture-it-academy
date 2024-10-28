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
		check('url').trim().isString().notEmpty().withMessage('A URL is required.'),
		check('method')
			.customSanitizer((value) => value.toUpperCase())
			.trim()
			.isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
			.withMessage('A valid HTTP method is required.'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				status: 400,
				error: 'Validation failed',
				details: errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				})),
			});
		}

		const { url, method, headers = {}, body } = req.body;

		try {
			const response = await axios({
				method,
				url,
				headers,
				data: body || {},
				maxRedirects: 0,
				validateStatus: (status) => status < 500,
			});


			res.status(response.status).json({
				status: response.status,
				headers: response.headers,
				data: response.data, 
			});
		} catch (error) {
			if (error.response) {
				console.error('Error Response:', error.response.data);
				
				res.status(error.response.status).json({
					status: error.response.status,
					headers: error.response.headers,
					data: error.response.data, 
				});
			} else if (error.request) {
				res
					.status(502)
					.json({ error: 'Bad Gateway - Unable to reach the target server' });
			} else {
				console.error('Error Message:', error.message);
				res.status(500).json({ error: 'Internal server error' });
			}
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
