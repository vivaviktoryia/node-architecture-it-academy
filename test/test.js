const express = require('express');
const xss = require('xss-clean'); // Data sanitization - XSS

const logger = require('./utils/logger');
const getFilePath = require('./utils/getFilePath');

const resultsFileName = 'results.txt';
const logFileName = '_server.log';
const logFilePath = getFilePath(logFileName, true);
const resultsFilePath = getFilePath(resultsFileName, true);

const webserver = express();

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

const port = 7180 || 7181;

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logger.logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.get('/service1', (req, res, next) => {
	const fullUrl = logger.getFullUrl(req);
	console.log(`Full URL: ${fullUrl}`);

	res.status(200).send(`service1 ok! Full URL: ${fullUrl}`);

	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

// req.query - query params
webserver.get('/service2', (req, res, next) => {
	// res.send(`service2 ok, par1= ${req.query.par1}  par2= ${req.query.par2}`);
	res.status(200).send(`service2 ok, req.query= ${JSON.stringify(req.query)} `);

	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

// req.params - path variables
webserver.get('/service2b/:par1/:par2', (req, res, next) => {
	res
		.status(200)
		.send(`service2b ok, req.params= ${JSON.stringify(req.params)} `);

	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

// work with file
webserver.get('/service7', (req, res, next) => {
	res.status(200).sendFile(resultsFilePath);

	const logLine = logger.logRequest(req, res);

	logger.logLineAsync(logFilePath, logLine);
});

webserver.post('/service6', (req, res, next) => {
	res.status(200).send(`service6 ok, req.body= ${JSON.stringify(req.body)} `);
	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

// 404 error
webserver.use('*', (req, res, next) => {
	const msg = `Can't find ${req.originalUrl} on this server!`;
	res.status(404).send(msg);

	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

webserver.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	logger.logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logger.logLineSync(logFilePath, logLine);
	process.exit(1);
});
