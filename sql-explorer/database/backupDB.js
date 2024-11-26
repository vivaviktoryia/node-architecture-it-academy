require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || 'test';
const backupFileName = process.env.BACKUP_FILENAME || 'backup';
const migrationsFolder = process.env.MIGRATIONS_FOLDER || 'database/migrations';

if (!password) {
	console.error('DB_PASSWORD is required in the environment variables.');
	process.exit(1);
}

const timestamp = new Date()
	.toISOString()
	.replace(/[:.]/g, '-')
	.replace('T', '_');

const backupDir = path.join(__dirname, 'database', 'backup');

if (!fs.existsSync(backupDir)) {
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
				reject(`stderr: ${stderr}`);
				return;
			}
			resolve(`Command executed successfully: ${stdout}`);
		});
	});
};

const getExportDBCommand = (withData = true) => {
	const dataOption = withData ? '' : '--no-data';
	return `mysqldump -u ${user} -p${password} --databases ${dataOption} --add-drop-database ${dbName} > ${backupDir}/${backupFileName}_${dbName}_${timestamp}.sql`;
};

const getImportDBCommand = (fileName) => {
	return `mysql -u ${user} -p${password} ${dbName} < ${fileName}`;
};


const backupDatabase = async () => {
	console.log('Backing up database...');
	const backupCommand = getExportDBCommand();
	try {
		await runCommand(backupCommand);
		console.log('Backup completed successfully.');
	} catch (error) {
		console.error(`Error during backup: ${error}`);
	}
};

const restoreDatabase = async (backupFile) => {
	console.log(`Restoring database from backup: ${backupFile}...`);
	const restoreCommand = getImportDBCommand(backupFile);
	try {
		await runCommand(restoreCommand);
		console.log('Database restored successfully.');
	} catch (error) {
		console.error(`Error during restore: ${error}`);
	}
};

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


const executeAction = async (action, fileName) => {
	try {
		switch (action) {
			case 'export': {
				const withData = migrationAction === '--with-data';
				console.log(
					`Exporting database ${dbName} ${
						withData ? 'with data' : 'without data'
					}...`,
				);
				const command = getExportDBCommand(withData);
				const result = await runCommand(command);
				console.log(result);
				break;
			}
			case 'import': {
				if (!fileName) {
					console.error('Please specify the import file.');
					return;
				}
				console.log(`Importing database ${dbName} from file ${fileName}...`);
				const command = getImportDBCommand(fileName);
				const result = await runCommand(command);
				console.log(result);
				break;
			}
			case 'migrate': {
				if (!fileName) {
					console.error('Please specify the migration file.');
					return;
				}
				await backupDatabase();
				await executeMigration(fileName);
				break;
			}
			case 'rollback': {
				const backupFiles = await fs.readdir(backupDir);
				const sortedBackupFiles = backupFiles
					.filter((file) => file.endsWith('.sql'))
					.sort();
				if (sortedBackupFiles.length === 0) {
					console.error('No backup files found for rollback.');
					return;
				}
				const lastBackup = path.join(
					backupDir,
					sortedBackupFiles[sortedBackupFiles.length - 1],
				);
				console.log(`Rolling back to last backup: ${lastBackup}`);
				await restoreDatabase(lastBackup);
				break;
			}
			default:
				console.error(
					'Please specify a valid action: "export", "import", "migrate", or "rollback"',
				);
		}
	} catch (error) {
		console.error(`Action failed: ${error}`);
	}
};

const [action, fileName] = process.argv.slice(2);
executeAction(action, fileName);
// npm run db:migrate -- migration_file.sql
