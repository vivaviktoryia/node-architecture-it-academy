const dotenv = require('dotenv');
const express = require('express');
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

webserver.get('/', (req, res, next) => {
	res.status(200).render('base');
	// .send('<h1> Hi! From MyPostman! </h1>');
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
