const path = require('path');
const { getConnection } = require('../../config/db');
const { logLineAsync } = require('../utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const executeQuery = async (req, res) => {
	let connection;
	const { query } = req.body;

	if (!query) {
		const errorMessage = 'SQL query is required!';
		await logLineAsync(logFilePath, errorMessage);
		return res.status(400).json({
			success: false,
			error: errorMessage,
			database: connection ? await getCurrentDatabase(connection) : 'None',
		});
	}

	try {
		connection = await getConnection();
		const normalizedQuery = query.trim().toUpperCase();

		const response = normalizedQuery.startsWith('SHOW DATABASES')
			? await handleShowDatabases(connection)
			: normalizedQuery.startsWith('SHOW TABLES')
			? await handleShowTables(connection)
			: normalizedQuery.startsWith('USE ')
			? await handleUseDatabase(connection, query)
			: await handleStandardQuery(connection, query);

		response.database = await getCurrentDatabase(connection);
		res.status(200).json(response);
	} catch (err) {
		await logLineAsync(logFilePath, err.message);
		res.status(400).json({ success: false, error: err.message });
	} finally {
		connection?.release();
	}
};

async function handleShowDatabases(connection) {
	const [rows] = await connection.query('SHOW DATABASES');
	return {
		success: true,
		type: 'show_databases',
		data: rows,
	};
}

async function handleShowTables(connection) {
	const [rows] = await connection.query('SHOW TABLES');
	return {
		success: true,
		type: 'show_tables',
		data: rows,
	};
}

async function handleUseDatabase(connection, query) {
	await connection.query(query);
	const database = query.split(' ')[1];
	return {
		success: true,
		type: 'use_database',
		message: `Database changed to ${database}`,
	};
}

async function handleStandardQuery(connection, query) {
	const [rows] = await connection.query(query);
	const response = Array.isArray(rows)
		? { success: true, type: 'select', data: rows }
		: { success: true, type: 'update', affectedRows: rows.affectedRows };
	return response;
}

async function getCurrentDatabase(connection) {
	try {
		const [rows] = await connection.query('SELECT DATABASE() AS database');
		return rows[0]?.database || 'None';
	} catch (err) {
		console.error('Error fetching current database:', err.message);
		return 'Unknown';
	}
}

module.exports = { executeQuery };
