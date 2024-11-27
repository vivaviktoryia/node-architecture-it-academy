require('dotenv').config();
const path = require('path');
const { runCommand } = require('./utils');
const { backupDatabase } = require('./backup');

const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || 'test';
const migrationsFolder =
	process.env.MIGRATIONS_FOLDER ||
	path.join(__dirname, '../database/migrations');

if (!password) {
	console.error('DB_PASSWORD is required in the environment variables.');
	process.exit(1);
}

const executeMigration = async (migrationFile) => {
	console.log(`Applying migration ${migrationFile}...`);
	const migrationPath = path.join(migrationsFolder, migrationFile);
	const command = `mysql -u ${user} -p${password} ${dbName} < ${migrationPath}`;

	try {
		await runCommand(command);
		console.log(`Migration ${migrationFile} applied successfully.`);
	} catch (error) {
		console.error(`Migration failed: ${error}`);
		throw new Error('Migration failed');
	}
};

const migrate = async (migrationFile) => {
	await backupDatabase();
	await executeMigration(migrationFile);
};

module.exports = { migrate };
