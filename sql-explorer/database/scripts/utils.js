const { exec } = require('child_process');
const path = require('path');

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
			resolve(stdout);
		});
	});
};

const getExportDBCommand = (
	user,
	password,
	dbName,
	backupDir,
	backupFileName,
	timestamp,
	withData = true,
) => {
	const dataOption = withData ? '' : '--no-data';
	return `mysqldump -u ${user} -p${password} --databases ${dataOption} --add-drop-database ${dbName} > ${backupDir}/${backupFileName}_${dbName}_${timestamp}.sql`;
};

const getImportDBCommand = (user, password, dbName, fileName) => {
	return `mysql -u ${user} -p${password} ${dbName} < ${fileName}`;
};

module.exports = { runCommand, getExportDBCommand, getImportDBCommand };
