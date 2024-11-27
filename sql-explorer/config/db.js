const mysql = require('mysql2/promise');

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
	
	console.info('Attempting to connect to MariaDB ...');
	console.info(`Connecting to: ${user}@${host}:${port} / ${database}`);

	return mysql.createConnection(connectionConfig);
};

module.exports = { createConnection };
