const { readFile, writeFile } = require('fs').promises;
const getFilePath = require('./getFilePath');
const { logLineSync } = require('./logger');

const logFileName = '_server.log';
const logFilePath = getFilePath(logFileName, true);

const emptyStatistics = { 0: 0, 1: 0, 2: 0 };

async function loadStatistics(filePath) {
	try {
		const data = await readFile(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (err) {
		return { ...emptyStatistics };
	}
}

async function saveStatistics(statistics, filePath) {
    
	try {
		await writeFile(filePath, JSON.stringify(statistics));
	} catch (err) {
		logLineSync(logFilePath, `Error saving statistics: ${err.message}`);
	}
}

module.exports = {
	loadStatistics,
	saveStatistics,
};
