const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');

const {
	ensureUploadDir,
	readDataFile,
	writeDataFile,
} = require('../src/services/fileService');
const { logError, logInfo } = require('../utils/logger');

dotenv.config({ path: `${__dirname}/.env` });

const app = require('../app');
const { console } = require('inspector');
const port = process.env.PORT || 7181;

const uploadDir = path.resolve(__dirname, './uploads');
const activeUploads = new Map();

const handleUncaughtException = async (err) => {
	const logLine = `UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`;
	await logError(logLine);
	process.exit(1);
};

const handleUnhandledRejection = async (err, server) => {
	const logLine = `UNHANDLED REJECTION!💥 ${err.name}: ${err.message}`;
	await logError(logLine);
	server.close(() => {
		process.exit(1);
	});
};

const handleFileUploadStart = async (socket, data, cb) => {
	try {
		if (!data || !data.fileName || !data.totalSize || !data.comment) {
			throw new Error('Invalid upload start data');
		}

		const fileID = uuidv4();
		const { fileName, totalSize, comment } = data;
		const filePath = path.join(uploadDir, fileName);

		await ensureUploadDir();
		const writeStream = fs.createWriteStream(filePath);

		activeUploads.set(socket.id, {
			fileID,
			fileName,
			totalSize,
			comment,
			filePath,
			uploadedBytes: 0,
			writeStream,
		});

		cb({ status: 'ready', message: 'Upload initialized' });
		await logInfo('Upload initialized');
	} catch (error) {
		await logError('Error in fileUploadStart:', error);
		cb({ status: 'error', message: error.message });
	}
};

const handleFileUploadChunk = (socket, chunk, cb) => {
	const upload = activeUploads.get(socket.id);
	if (!upload) {
		return cb({ status: 'error', message: 'Upload not initialized' });
	}

	const { writeStream, totalSize } = upload;
	if (writeStream.writableEnded) {
		return cb({ status: 'error', message: 'Upload stream is already closed' });
	}

	try {
		const buffer = Buffer.from(chunk);
		writeStream.write(buffer, (err) => {
			if (err) {
				return cb({ status: 'error', message: 'Error writing file chunk' });
			}

			upload.uploadedBytes += buffer.length;
			const progress = Math.round((upload.uploadedBytes / totalSize) * 100);
			console.log(progress);
			cb({ status: 'success', progress });
		});
	} catch (error) {
		cb({ status: 'error', message: 'Error writing file chunk' });
	}
};

const handleFileUploadEnd = async (socket, cb) => {
	const upload = activeUploads.get(socket.id);
	console.log('handleFileUploadEnd', activeUploads);

	if (!upload) {
		return cb({ status: 'error', message: 'Upload not initialized' });
	}

	const { writeStream, fileID, fileName, comment } = upload;
	if (!writeStream || writeStream.writableEnded) {
		return cb({ status: 'error', message: 'Upload already finalized' });
	}

	try {
		writeStream.end(async () => {
			const newFile = {
				fileID,
				fileName,
				comment,
				createdAt: DateTime.now().toUTC(),
			};

			const data = await readDataFile();
			data.files.push(newFile);
			await writeDataFile(data);

			activeUploads.delete(socket.id);
			cb({ status: 'finish', message: 'File upload complete' });
			socket.disconnect();
		});
	} catch (error) {
		cb({ status: 'error', message: 'Error completing upload' });
	}
};

const handleClientDisconnect = (socket) => {
	const upload = activeUploads.get(socket.id);
	if (upload) {
		const { filePath, writeStream } = upload;

		writeStream.end(() => {
			fs.unlink(filePath, (err) => {
				if (err) console.error(`Error deleting file ${filePath}:`, err);
				else console.log(`Partially uploaded file ${filePath} deleted.`);
			});
		});

		activeUploads.delete(socket.id);
	}

	console.log(`Client disconnected with sid ${socket.id}`);
};

process.on('uncaughtException', handleUncaughtException);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', async (socket) => {
	await logInfo(`New client connected with sid ${socket.id}`);

	socket.on('fileUploadStart', (data, cb) =>
		handleFileUploadStart(socket, data, cb),
	);
	socket.on('fileUploadChunk', (chunk, cb) =>
		handleFileUploadChunk(socket, chunk, cb),
	);
	socket.on('fileUploadEnd', (cb) => handleFileUploadEnd(socket, cb));
	socket.on('disconnect', () => handleClientDisconnect(socket));
});

server.listen(port, async () => {
	const logLine = `Web server running on port ${port}, process.pid = ${process.pid}`;
	await logInfo(logLine);
});

process.on('unhandledRejection', (err) =>
	handleUnhandledRejection(err, server),
);
