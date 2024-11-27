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
	return mysql.createConnection(connectionConfig);
};

module.exports = { createConnection };
