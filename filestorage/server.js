const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fileService = require('./src/services/fileService');

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

// io.on('connection', (socket) => {
// 	console.log('A new WebSocket connection established');

// 	socket.on('message', (data) => {
// 		console.log('Message from client:', data);
// 		socket.emit('response', `Server received: ${data}`);
// 	});

// 	socket.on('uploadProgress', (data) => {
// 		console.log(`Upload progress: ${data.progress}%`);
// 		socket.broadcast.emit('uploadProgress', data);
// 	});

// 	socket.on('uploadComplete', (data) => {
// 		console.log('Upload completed:', data.message);
// 		socket.emit('uploadComplete', data);
// 	});

// 	socket.on('uploadError', (data) => {
// 		console.log('Upload error:', data.message);
// 		socket.emit('uploadError', data);
// 	});

// 	socket.on('disconnect', () => {
// 		console.log('A WebSocket client disconnected');
// 	});
// });

const uploadDir = path.resolve(__dirname, 'uploads');
const dataFilePath = path.resolve(uploadDir, 'filesData.json');

fileService.ensureUploadDir();

io.on('connection', (socket) => {
	console.log('New client connected');
	let currentFile = null;

	socket.on('fileUploadStart', (data) => {
		const { fileName, totalSize, comment } = data;
		console.log(data);
		const safeName = `${Date.now()}-${fileName}`;
		currentFile = {
			originalName: fileName,
			path: path.join(uploadDir, safeName),
			comment,
			size: totalSize,
			receivedBytes: 0,
			stream: fs.createWriteStream(path.join(uploadDir, safeName)),
		};
		console.log(`Starting upload: ${fileName} with comment: ${comment}`);
	});

	socket.on('fileUploadChunk', (chunk) => {
		if (!currentFile || !currentFile.stream) {
			socket.emit('uploadError', { message: 'Upload not initialized' });
			return;
		}
		currentFile.stream.write(Buffer.from(chunk));
		currentFile.receivedBytes += chunk.byteLength;

		const progress = Math.round(
			(currentFile.receivedBytes / currentFile.size) * 100,
		);
		socket.emit('uploadProgress', { progress });
		console.log(`Progress: ${progress}%`);
	});

socket.on('fileUploadEnd', () => {
	if (currentFile && currentFile.stream) {
		currentFile.stream.end();

		// Assume metadata update happens successfully
		const fileUrl = `/uploads/${path.basename(currentFile.path)}`; // Adjust the URL according to your app's structure

		socket.emit('uploadComplete', {
			message: `File "${currentFile.originalName}" uploaded successfully!`,
			fileUrl: fileUrl, // Send the file URL to the client
		});
	} else {
		socket.emit('uploadError', { message: 'No active upload' });
	}
	currentFile = null;
});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
		if (currentFile && currentFile.stream) {
			currentFile.stream.close();
		}
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
