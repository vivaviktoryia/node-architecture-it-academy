const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'lexus_ita',
	database: 'test',
	connectionLimit: 5,
});

module.exports = {pool};
