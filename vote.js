const express = require('express');
const path = require('path');

const xss = require('xss-clean'); // Data sanitization - XSS

const logger = require('./utils/logger');
const getFilePath = require('./utils/getFilePath');

const resultsFileName = 'results.txt';
const logFileName = '_server.log';
const logFilePath = getFilePath(logFileName, true);
const resultsFilePath = getFilePath(resultsFileName, true);

const webserver = express();

webserver.set('view engine', 'pug');
webserver.set('views', getFilePath('views', true));

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

const port = 7180 || 7181;

webserver.use(express.static(path.join(__dirname, 'public'))); 

const variants = [
	{ code: 0, text: 'JavaScript' },
	{ code: 1, text: 'Python' },
	{ code: 2, text: 'Java' },
];

// Vote statistics
const statistics = {
	0: 0,
	1: 0,
	2: 0,
};

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logger.logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.get('/variants', (req, res, next) => {
	res.status(200).json(variants);
	const logLine = logger.logRequest(req, res);
	logger.logLineAsync(logFilePath, logLine);
});

webserver.post('/stat', (req, res, next) => {
	const stats = variants.map((variant) => ({
		code: variant.code,
		votes: statistics[variant.code],
	}));
	res.status(200).json(stats);
});


webserver.post('/vote', (req, res, next) => {
	const { code } = req.body;
	const stats = variants.map((variant) => ({
		text: variant.text,
		votes: statistics[variant.code],
	}));

	if (
		
		Object.keys(req.body).length === 0 ||
		statistics[code] === undefined
	) {
		res.render('statistics', {
			status: 'error',
			message:
				Object.keys(req.body).length === 0 || statistics[code] === undefined
					? 'No vote submitted! Please select an option.'
					: 'Vote not accepted! Invalid option code.',
			stats,
		});
		return; 
	}

	statistics[code]++;
	res.render('statistics', {
		status: 'success',
		message: 'Vote accepted!',
		stats,
	});
});


webserver.get('/', (req, res, next) => {
	res.render('voting', { variants });
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
