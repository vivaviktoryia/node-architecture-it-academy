const mysql = require('mysql2/promise');

const connectionConfig = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'lexus_ita',
	database: 'test',
	connectionLimit: 5,
};

const executeQuery = async (req, res) => {
	const { query } = req.body;

	if (!query) {
		return res
			.status(400)
			.json({ success: false, error: 'SQL query is required.' });
	}

	let connection = null;
	try {
		connection = await mysql.createConnection(connectionConfig);

		const [rows, fields] = await connection.execute(query);
		if (Array.isArray(rows)) {
			// SELECT
			res.json({ success: true, type: 'select', data: rows });
		} else {
			// INSERT, UPDATE, DELETE
			res.json({
				success: true,
				type: 'update',
				affectedRows: rows.affectedRows,
			});
		}
	} catch (err) {
	
		res.status(400).json({ success: false, error: err.message });
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};

module.exports = { executeQuery };
