const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const { logError, logInfo } = require('./utils/logger');

dotenv.config({ path: `${__dirname}/.env` });

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mariadb',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
);

async function checkDatabaseConnection() {
	try {
		await sequelize.authenticate();
		await logInfo(
			'Connection to the database has been established successfully.',
		);
	} catch (error) {
		await logError('Unable to connect to the database:', error);
		process.exit(1); 
	}
}

checkDatabaseConnection();

const app = require('./app');
const port = parseInt(process.env.PORT || 7181);

const server = app
	.listen(port, async () => {
		const logLine = `Web server running on port ${port}, process.pid = ${process.pid}`;
		await logInfo(logLine);
	})
	.on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			console.log(`Port ${port} is already in use, trying another one...`);
			const newPort = port + 1;
			app.listen(newPort, () => {
				console.log(`Web server running on port ${newPort}`);
			});
		}
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
