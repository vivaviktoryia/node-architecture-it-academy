const fs = require('fs');
const { pipeline } = require('stream/promises');
const path = require('path');
const zlib = require('zlib');
const _ = require('lodash');
const folderPath = './folder-to-check';
const { logMessage } = require('./utils');

async function getAllFiles(dir, fileList = []) {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		entry.isDirectory()
			? await getAllFiles(fullPath, fileList)
			: fileList.push(fullPath);
	}

	return fileList;
}

async function createCompressedFile(filePath) {
	const gzFilePath = `${filePath}.gz`;

	try {
		await fs.promises.access(filePath);
		logMessage(`Start compression: "${filePath}" → "${gzFilePath}"`);

		await pipeline(
			fs.createReadStream(filePath),
			zlib.createGzip(),
			fs.createWriteStream(gzFilePath),
		);

		logMessage(`Archive created: "${gzFilePath}"`);
	} catch (error) {
		logMessage(`File compression error: ${error.message}`, 'error');
	}
}

async function checkCompressedFile(filePath) {
	const compressedFilePath = `${filePath}.gz`;

	try {
		const originalStats = await fs.promises.stat(filePath).catch((error) => {
			logMessage(`Error accessing "${filePath}": ${error.message}`, 'error');
			return null;
		});

		const compressedStats = await fs.promises
			.stat(compressedFilePath)
			.catch(() => null);

		if (!compressedStats) {
			logMessage(
				`Compressed file "${filePath}" does not exist, creating:  "${filePath}" → "${compressedFilePath}"`,
			);
			return false;
		}

		if (compressedStats) {
			logMessage(
				`Compressed file "${compressedFilePath}" for "${filePath}" exists, checking modification dates...`,
			);

			const message =
				compressedStats.mtime >= originalStats.mtime
					? `Compressed file "${compressedFilePath}" is up to date: "${compressedFilePath}"`
					: `Compressed file "${compressedFilePath}" is outdated, recreating: "${compressedFilePath}"`;

			logMessage(message);
			return compressedStats.mtime >= originalStats.mtime;
		}
	} catch (error) {
		logMessage(
			`Error checking compressed file "${filePath}": ${error.message}`,
			'error',
		);
		return false;
	}
}

async function compressFile(filePath) {
	if (filePath.endsWith('.gz')) {
		return;
	}
	const shouldCompress = await checkCompressedFile(filePath);

	if (!shouldCompress) {
		await createCompressedFile(filePath);
	}
}

async function autoCompress(directory) {
	logMessage(`Scan folder: "${directory}"`);
	try {
		const allFiles = await getAllFiles(directory);

		const [archivedFiles, notArchivedFiles] = _.partition(allFiles, (file) =>
			file.endsWith('.gz'),
		);

		logMessage(`Total files found: ${allFiles.length}`, 'log', allFiles);
		logMessage(`Archived files: ${archivedFiles.length}`, 'log', archivedFiles);
		logMessage(
			`Files to be compressed: ${notArchivedFiles.length}`,
			'log',
			notArchivedFiles,
		);

		for (const file of notArchivedFiles) {
			await compressFile(file);
		}
		logMessage(`Completed compression of files in folder: "${directory}"`);
	} catch (err) {
		logMessage(`Error scanning folder: ${err.message}`, 'error');
	}
}

const directory = process.argv[2];
if (!directory) {
	console.error("Specify the folder path as an argument! Example: './folder-to-check'");
	process.exit(1);
}

autoCompress(directory);
