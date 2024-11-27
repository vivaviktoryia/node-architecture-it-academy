const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const user = process.env.DB_USER || 'nodeuser';
const dbName = process.env.DB_NAME || 'learning_db';
const backupDir = path.join(__dirname, '../backup'); 


if (!fs.existsSync(backupDir)) {
	console.log('Backup directory not found, creating...');
	fs.mkdirSync(backupDir, { recursive: true });
}

const runCommand = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error executing command: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
				reject(`stderr: ${stderr}`); 
				return;
			}
			resolve(stdout);
		});
	});
};

const getExportDBCommand = (
	user,
dbName,
	backupDir,
	timestamp,
	withData = true,
) => {
	const dataOption = withData ? '' : '--no-data';

	return `mysqldump -u ${user} -p --databases ${dataOption} --add-drop-database --no-tablespaces --skip-column-statistics  ${dbName} > ${backupDir}/backup_${dbName}_${timestamp}.sql`;
};

const getImportDBCommand = (user, dbName, fileName) => {
	return `mysql -u ${user} -p ${dbName} < ${fileName}`;
};


const timestamp = new Date()
	.toISOString()
	.replace(/[:.]/g, '-')
	.replace('T', '_');

const backupDatabase = async (withData = true) => {
	console.log('Backing up database...');
	const backupCommand = getExportDBCommand(
		user,
		dbName,
		backupDir,
		timestamp,
		withData,
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
	const restoreCommand = getImportDBCommand(user, dbName, backupFile);
	try {
		await runCommand(restoreCommand);
		console.log('Database restored successfully.');
	} catch (error) {
		console.error(`Error during restore: ${error}`);
	}
};

const args = process.argv.slice(2);

if (args[0] === 'backup') {
	const withData = args[1] !== '--without-data';
	backupDatabase(withData);
} else if (args[0] === 'restore') {
	const backupFile = args[1];
	if (!backupFile) {
		console.error('Please provide the backup file path for restore.');
		process.exit(1);
	}
	restoreDatabase(backupFile);
} else {
	console.error('Invalid command. Use "backup" or "restore".');
	process.exit(1);
}

module.exports = { backupDatabase, restoreDatabase };
