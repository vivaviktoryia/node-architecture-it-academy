const { createConnection } = require('../../config/db');

const executeQuery = async (req, res) => {
	const { query } = req.body;

	if (!query) {
		return res.status(400).json({
			success: false,
			error: 'SQL query is required.',
		});
	}

	let connection;
	try {
		connection = await createConnection();
		const [rows] = await connection.execute(query);
		const response = Array.isArray(rows)
			? { success: true, type: 'select', data: rows }
			: { success: true, type: 'update', affectedRows: rows.affectedRows };

		res.json(response);
	} catch (err) {
		res.status(400).json({
			success: false,
			error: err.message,
		});
	} finally {
		if (connection) {
			try {
				await connection.end();
			} catch (err) {
				console.error('Error closing connection:', err.message);
			}
		}
	}
};

module.exports = { executeQuery };
