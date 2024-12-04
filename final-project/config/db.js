const { Sequelize } = require('sequelize');
const { logError, logInfo } = require('../utils/logger');


const getSequelizeInstance = () => {
	const dialect = process.env.DB_CLIENT || 'mariadb';
	const host = process.env.DB_HOST || 'localhost';
	const port = process.env.DB_PORT || 3306;
	const username = process.env.DB_USER || 'root';
	const password = process.env.DB_PASSWORD;
	const database = process.env.DB_NAME || 'test';

	const poolConfig = {
		max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
		min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
		acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
		idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
	};

	const sequelize = new Sequelize(database, username, password, {
		host,
		dialect,
		port,
		pool: poolConfig,
		logging: process.env.DB_LOGGING === true,
	});

	return sequelize;
};

async function checkDatabaseConnection() {
	const sequelize = getSequelizeInstance();

	try {
		await sequelize.authenticate();
		await logInfo(
			`Connection to the database '${process.env.DB_NAME}' has been established successfully.`,
		);
	} catch (error) {
		await logError(
			`Unable to connect to the database '${process.env.DB_NAME}': ${error}`,
		);
		process.exit(1);
	}
}

module.exports = {
	getSequelizeInstance,
	checkDatabaseConnection,
};
