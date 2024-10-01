const express = require('express');

const {
	logLineSync,
	logLineAsync,
	logServerRunning,
	logRequest,
} = require('./utils/logger');

const getFilePath = require('./utils/getFilePath');

const resultsFileName = 'results.txt';
const logFileName = '_server.log';
const logFilePath = getFilePath(logFileName, true);
const resultsFilePath = getFilePath(resultsFileName, true);

const webserver = express();

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

const port = 7180 || 7181;

webserver.get('/service1', (req, res, next) => {
	const fullUrl = getFullUrl(req);
	console.log(`Full URL: ${fullUrl}`);

	res.send(`service1 ok! Full URL: ${fullUrl}`);

	const logLine = logRequest(req, res);
	logLineAsync(logFilePath, logLine);
});

// req.query - query params
webserver.get('/service2', (req, res, next) => {
	logLineSync(logFilePath, `${req.originalUrl} called`);
	// res.send(`service2 ok, par1= ${req.query.par1}  par2= ${req.query.par2}`);
	res.send(`service2 ok, req.query= ${JSON.stringify(req.query)} `);
});

// req.params - path variables
webserver.get('/service2b/:par1/:par2', (req, res, next) => {
	// res.send(`service2b ok, par1= ${req.params.par1}  par2= ${req.params.par2}`);
	res.send(`service2b ok, req.params= ${JSON.stringify(req.params)} `);

	const logLine = logRequest(req, res);
	logLineAsync(logFilePath, logLine);
});

// work with file
webserver.get('/service7', (req, res, next) => {
	res.sendFile(resultsFileName);
	const logLine = logRequest(req, res);
	logLineAsync(logFilePath, logLine);
});

webserver.post('/service6', (req, res, next) => {
	logLineSync(logFilePath, `${req.originalUrl} called`);
	console.log(req.body);
	res.send(`service6 ok, req.body= ${JSON.stringify(req.body)} `);
});

// 404 error
webserver.use('*', (req, res, next) => {
	
	const msg = `Can't find ${req.originalUrl} on this server!`;
	res.status(404).send(msg);

	const logLine = logRequest(req, res);
	logLineAsync(logFilePath, logLine);
});

webserver.listen(port, () => {
	const logLine = logServerRunning(port);
	logLineAsync(logFilePath, logLine);
});
