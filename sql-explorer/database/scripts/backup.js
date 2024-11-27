require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const {
	runCommand,
	getExportDBCommand,
	getImportDBCommand,
} = require('./utils');

const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || 'test';
const backupFileName = process.env.BACKUP_FILENAME || 'backup';
const backupDir = path.join(__dirname, '../database/backup');

if (!password) {
	console.error('DB_PASSWORD is required in the environment variables.');
	process.exit(1);
}

const timestamp = new Date()
	.toISOString()
	.replace(/[:.]/g, '-')
	.replace('T', '_');

const backupDatabase = async () => {
	console.log('Backing up database...');
	const backupCommand = getExportDBCommand(
		user,
		password,
		dbName,
		backupDir,
		backupFileName,
		timestamp,
	);
	try {
		await runCommand(backupCommand);
		console.log('Backup completed successfully.');
	} catch (error) {
		console.error(`Error during backup: ${error}`);
	}
};

const restoreDatabase = async (backupFile) => {
	console.log(`Restoring database from backup: ${backupFile}...`);
	const restoreCommand = getImportDBCommand(user, password, dbName, backupFile);
	try {
		await runCommand(restoreCommand);
		console.log('Database restored successfully.');
	} catch (error) {
		console.error(`Error during restore: ${error}`);
	}
};

module.exports = { backupDatabase, restoreDatabase };
