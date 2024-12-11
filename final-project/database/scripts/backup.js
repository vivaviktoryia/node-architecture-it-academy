const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const user = process.env.DB_USER || 'root';
const dbName = process.env.DB_NAME || 'final_project';
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
	const dataSuffix = withData ? 'with-data' : 'without-data';
	const backupFileName = `${backupDir}/backup_${dbName}_${dataSuffix}_${timestamp}.sql`;
	return `mysqldump -u ${user} -p --databases ${dataOption} --add-drop-database --no-tablespaces  ${dbName} > ${backupFileName}`;
};

const getImportDBCommand = (user, dbName, fileName) => {
	return `mysql -u ${user} -p ${dbName} < ${fileName}`;
};

// Add a command to check if the database exists
const checkIfDatabaseExistsCommand = (user, dbName) => {
	return `mysql -u ${user} -p -e "SHOW DATABASES LIKE '${dbName}'"`;
};

// Add a command to create the database if it doesn't exist
const createDatabaseCommand = (user, dbName) => {
	return `mysql -u ${user} -p -e "CREATE DATABASE IF NOT EXISTS ${dbName}"`;
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
	try {
		// Check if the database exists
		const checkCommand = checkIfDatabaseExistsCommand(user, dbName);
		const result = await runCommand(checkCommand);

		if (!result.includes(dbName)) {
			console.log(`Database ${dbName} does not exist. Creating it...`);
			const createCommand = createDatabaseCommand(user, dbName);
			await runCommand(createCommand);
			console.log(`Database ${dbName} created successfully.`);
		}

		// Now restore the database
		const restoreCommand = getImportDBCommand(user, dbName, backupFile);
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
