const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

const {
	handleFileUploadStart,
	handleFileUploadEnd,
	handleFileUploadChunk,
	handleClientDisconnect,
} = require('./src/controllers/fileController');

const { logError, logInfo } = require('./utils/logger');

dotenv.config({ path: `${__dirname}/.env` });

const app = require('./app');
const port = process.env.PORT || 7181;

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

process.on('uncaughtException', async (err) => {
	await logError(`UNCAUGHT EXCEPTION💥💥💥: ${err.message}`);
	process.exit(1);
});


process.on('unhandledRejection', async (err) => {
	await logError(`UNHANDLED REJECTION💥💥💥: ${err.message}`);
	server.close(() => process.exit(1));
});

server.listen(port, async () => {
	const logLine = `Web server running on port ${port}, process.pid = ${process.pid}`;
	await logInfo(logLine);
});
