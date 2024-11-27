const mysql = require('mysql2/promise');
const path = require('path');
const { logLineAsync } = require('../src/utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const connectionConfig = {
	host: process.env.HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || 'nodeuser',
	password: process.env.DB_USER_PASSWORD || 'nodepass',
	database: process.env.DB_NAME || 'learning_db',
	connectionLimit: 5,
	timezone: 'Z',
};

const createConnection = async () => {
	const { host, port, user, database } = connectionConfig;
	logLineAsync(logFilePath, 'Attempting to connect to MariaDB ...');
	logLineAsync(
		logFilePath,
		`Connecting to: ${user}@${host}:${port} / ${database}`,
	);

	return mysql.createConnection(connectionConfig);
};

module.exports = { createConnection };
