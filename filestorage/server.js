const dotenv = require('dotenv');

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

io.on('connection', (socket) => {
	console.log('A new WebSocket connection established');

	socket.on('message', (data) => {
		console.log('Message from client:', data);
		socket.emit('response', `Server received: ${data}`);
	});

	socket.on('uploadProgress', (data) => {
		console.log(`Upload progress: ${data.progress}%`);
		socket.broadcast.emit('uploadProgress', data);
	});

	socket.on('uploadComplete', (data) => {
		console.log('Upload completed:', data.message);
		socket.emit('uploadComplete', data);
	});

	socket.on('uploadError', (data) => {
		console.log('Upload error:', data.message);
		socket.emit('uploadError', data);
	});

	socket.on('disconnect', () => {
		console.log('A WebSocket client disconnected');
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
