const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const {
	ensureUploadDir,
	readDataFile,
	writeDataFile,
} = require('./src/services/fileService');
const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');

const http = require('http');
const socketIo = require('socket.io');

const { logError, logInfo } = require('./utils/logger');

dotenv.config({ path: `${__dirname}/.env` });

const app = require('./app');
const port = process.env.PORT || 7181;

process.on('uncaughtException', async (err) => {
	const logLine = `UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`;
	await logError(logLine);
	process.exit(1);
});

// HTTP server
const server = http.createServer(app);
// Initialize WebSocket server using HTTP server
const io = socketIo(server);

// SERVER listen (on):
// fileUploadStart
// fileUploadChunk
// fileUploadEnd
// disconnect

// SERVER emit:
// uploadProgress
// uploadError
// uploadComplete

const uploadDir = path.resolve(__dirname, './uploads');

io.on('connection', (socket) => {
	console.log(`New client connected with sid ${socket.id}`);
	let writeStream = null,
		isStreamEnded = false,
		uploadedBytes = 0,
		totalSize = 0,
		fileID = '',
		fileName = '',
		comment = '';

	socket.on('fileUploadStart', async (data) => {
		try {
			if (!data || !data.fileName || !data.totalSize || !data.comment) {
				throw new Error('Invalid upload start data');
			}
			if (isStreamEnded) return;
			fileName = data.fileName;
			totalSize = data.totalSize;
			comment = data.comment;
			fileID = uuidv4();

			await ensureUploadDir();
			const filePath = path.join(uploadDir, fileName);
			writeStream = fs.createWriteStream(filePath);
			uploadedBytes = 0;

			socket.emit('uploadStart', {
				fileName,
				totalSize,
				message: 'Upload initialized',
			});
		} catch (error) {
			console.error('Error in fileUploadStart:', error);
			socket.emit('uploadError', { message: error.message });
		}
	});

	socket.on('fileUploadChunk', (chunk) => {
		if (!writeStream) {
			socket.emit('uploadError', { message: 'Upload not initialized' });
			return;
		}

		if (writeStream.writableEnded) {
			socket.emit('uploadError', {
				message: 'Upload stream is already closed',
			});
			return;
		}
		if (isStreamEnded) return;
		try {
			const buffer = Buffer.from(chunk);
			writeStream.write(buffer, (err) => {
				if (err) {
					socket.emit('uploadError', { message: 'Error writing file chunk' });
					return;
				}
				uploadedBytes += buffer.length;
				const progress = Math.round((uploadedBytes / totalSize) * 100);
				socket.emit('uploadProgress', { progress });
			});
		} catch (error) {
			socket.emit('uploadError', { message: 'Error writing file chunk' });
		}
	});

	socket.on('fileUploadEnd', async () => {
		if (!writeStream || isStreamEnded) return;
		try {
			isStreamEnded = true;
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

				socket.emit('uploadComplete', { message: 'File upload complete' });
				socket.disconnect();
			});
		} catch (error) {
			socket.emit('uploadError', { message: 'Error completing upload' });
		}
	});

	socket.on('disconnect', () => {
		if (writeStream) writeStream.end();
		console.log('Client disconnected');
	});
});

server.listen(port, async () => {
	const logLine = `Web server running on port ${port}, process.pid = ${process.pid}`;
	await logInfo(logLine);
});

process.on('unhandledRejection', async (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	await logError(logLine);
	server.close(() => {
		process.exit(1);
	});
});
