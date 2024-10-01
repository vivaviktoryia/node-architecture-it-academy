const fs = require('fs');
const os = require('os');

 
const  logRequest = (req, res) => {
	return `${req.method} request ${req.originalUrl} - Status: ${res.statusCode} ${res.statusMessage} `;
}

const logServerRunning  = (port) => {
	return `Web server running on port  ${port}, process.pid = ${process.pid}`;
}

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
			else resolve();
		});
	});
};

// Asynchronous logging function
const logLineAsync = async (logFilePath, logLine) => {
	try {
		const fullLogLine = getFullLogLine(logLine);

		console.log(fullLogLine);

		await appendFilePromise(logFilePath, fullLogLine + os.EOL);
	} catch (error) {
		console.error('Error writing log:', error);
	}
};

module.exports = {
	logLineSync,
	logLineAsync,
	logServerRunning,
	logRequest,
};
