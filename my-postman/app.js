const dotenv = require('dotenv');
const express = require('express');
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

webserver.use(loggerMiddleware);

webserver.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.post('/request', async (req, res) => {
	const { url, method, headers, body } = req.body;

	try {
		const response = await axios({
			method: method,
			url: url,
			headers: headers,
			data: body,
		});


		res.render('request', {
			status: response.status,
			contentType: response.headers['content-type'],
			headers: response.headers,
			data: response.data,
			error: null,
		});

	} catch (error) {
		if (error.response) {
			res.render('request', {
				status: error.response.status,
				contentType: error.response.headers['content-type'],
				headers: error.response.headers,
				data: error.response.data,
				error: error.message,
			});
		} else {
			res.render('request', {
				status: 500,
				contentType: null,
				headers: {},
				data: null,
				error: 'Something went wrong',
			});
		}
	}
});

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
