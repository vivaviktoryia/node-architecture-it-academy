const mysql = require('mysql2/promise');
const path = require('path');
const { logLineAsync } = require('../src/utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const poolConfig = {
	host: process.env.HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_USER_PASSWORD || '1234',
	connectionLimit: 5,
	timezone: 'Z',
};

const pool = mysql.createPool(poolConfig);

const getConnection = async () => {
	await logLineAsync(logFilePath, 'Getting connection from pool...');
	return pool.getConnection();
};

module.exports = { getConnection, pool };
