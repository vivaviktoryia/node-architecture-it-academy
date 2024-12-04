const dotenv = require('dotenv');
const { checkDatabaseConnection } = require('./config/db');
const { logError, logInfo } = require('./utils/logger');

dotenv.config({ path: `${__dirname}/config.env` });

checkDatabaseConnection();

const app = require('./app');
const port = parseInt(process.env.PORT || 7181);

const server = app.listen(port, async () => {
	const logLine = `Web server running on port ${port}, process.pid = ${process.pid}`;
	await logInfo(logLine);
});

process.on('uncaughtException', async (err) => {
	const logLine = `UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`;
	await logError(logLine);
	process.exit(1);
});

process.on('unhandledRejection', async (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	await logError(logLine);
	server.close(() => {
		process.exit(1);
	});
});
