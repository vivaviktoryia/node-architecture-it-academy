const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const logRequest = (req, res) => {
	let requestData;

	if (req.method === 'GET') {
		requestData = Object.keys(req.params).length > 0 ? req.params : req.query;
	} else if (req.method === 'POST') {
		requestData = req.body;
	} else requestData = {};

	const statusMessage = res.statusMessage || http.STATUS_CODES[res.statusCode];

	return `${req.method} ${req.originalUrl} - Status ${
		res.statusCode
	} ${statusMessage}, requestData: ${JSON.stringify(requestData)}`;
};

const getFullLogLine = (logLine) => {
	const logDate = new Date();
	const date = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()}`;

	return `${date} - ${logLine}`;
};

const getFullUrl = (req) => {
	return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};

// Synchronous logging function
const logLineSync = (logFilePath, logLine) => {
	const fullLogLine = getFullLogLine(logLine);

	console.log(fullLogLine);

	const logFd = fs.openSync(logFilePath, 'a+');
	fs.writeSync(logFd, fullLogLine + os.EOL);
	fs.closeSync(logFd);
};

const appendFilePromise = (filePath, data) => {
	return new Promise((resolve, reject) => {
		fs.appendFile(filePath, data, (error) => {
			if (error) reject(error);
			resolve();
		});
	});
};

// Asynchronous logging function
const logLineAsync = async (logFilePath, logLine) => {
	try {
		if (!logLine) {
			throw new Error('logLine is undefined or null');
		}

		const fullLogLine = getFullLogLine(logLine);

		console.log(fullLogLine);

		await appendFilePromise(logFilePath, fullLogLine + os.EOL);
	} catch (error) {
		console.error('Error writing log:', error);
	}
};

// Logger middleware function
const loggerMiddleware = (req, res, next) => {
	const logLine = logRequest(req, res);
	logLineAsync(logFilePath, logLine);
	next();
};

module.exports = {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
};
