const path = require('path');
const dotenv = require('dotenv');
const app = require('./app');

const {
	logLineSync,
	logLineAsync,	
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });

const port = process.env.PORT || 7181;

const server = app.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	server.close(() => {
		process.exit(1);
	});
});
