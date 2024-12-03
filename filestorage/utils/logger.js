const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { promisify } = require('util');
const { DateTime } = require('luxon');

const appendFileAsync = promisify(fs.appendFile);

const logsDir = path.resolve(__dirname, '../logs');
const logFile = path.resolve(logsDir, '_server.log');

if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat =
	':method :url :status :response-time ms - :res[content-length] :remote-addr';

const formatLogDate = () => {
	return DateTime.now().toUTC().toFormat('yyyy-MM-dd HH:mm:ss ZZZZ');
};

const writeLog = async (message, typeLog = 'log') => {
	const timestamp = `[${formatLogDate()}]`;
	const logLine = `${timestamp} - ${message}`;
	try {
		await appendFileAsync(logFile, logLine + '\n', 'utf8');
		console[typeLog](logLine);
	} catch (err) {
		console.error('Error writing log:', err);
	}
};

const setupMorgan = (app) => {
	// app.use(morgan('dev'));
	app.use(
		morgan(logFormat, {
			stream: {
				write: (message) => {
					writeLog(message.trim()).catch((err) => {
						console.error('Error logging request:', err);
					});
				},
			},
		}),
	);
};

const logInfo = async (message) => {
	const logMessage = `INFO: ${message}`;
	await writeLog(logMessage, 'info');
};

const logError = async (message) => {
	const logMessage = `ERROR: ${message}`;
	await writeLog(logMessage, 'error');
};

module.exports = { logInfo, logError, setupMorgan };
