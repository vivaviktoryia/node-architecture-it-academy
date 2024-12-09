const fs = require('fs');
const { pipeline } = require('stream/promises');
const path = require('path');
const zlib = require('zlib');
const { logMessage } = require('./utils');

async function processDirectory(directory) {
	try {
		const entries = await fs.promises.readdir(directory, {
			withFileTypes: true,
		});

		for (const entry of entries) {
			const fullPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				await processDirectory(fullPath);
			} else if (!fullPath.endsWith('.gz')) {
				await compressFile(fullPath);
			}
		}
	} catch (error) {
		logMessage(
			`Error processing directory "${directory}": ${error.message}`,
			'error',
		);
	}
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

const directory = process.argv[2];
if (!directory) {
	console.error(
		"Specify the folder path as an argument! Example: './folder-to-check'",
	);
	process.exit(1);
}

processDirectory(directory)
	.then(() => logMessage(`Completed processing directory: "${directory}"`))
	.catch((err) => logMessage(`Error: ${err.message}`, 'error'));
