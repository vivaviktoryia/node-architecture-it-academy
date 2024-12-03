const path = require('path');
const fs = require('fs');
const fileService = require('../services/fileService');

const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.resolve(__dirname, '../../uploads');
const activeUploads = new Map();

// UPLOAD via WS
const handleFileUploadStart = async (socket, data, cb) => {
	try {
		if (!data || !data.fileName || !data.totalSize || !data.comment) {
			throw new Error('Invalid upload start data');
		}

		const fileID = uuidv4();
		const { fileName, totalSize, comment } = data;
		const filePath = path.join(uploadDir, fileName);

		await fileService.ensureUploadDir();
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

			const data = await fileService.readDataFile();
			data.files.push(newFile);
			await fileService.writeDataFile(data);

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


// UPLOAD via HTTP
const uploadFileHttp = async (req, res, next) => {
	try {
		const { file } = req;
		const { comment } = req.body;

		if (!file) {
			return res
				.status(400)
				.json({ status: 'error', message: 'No file uploaded' });
		}
		if (!comment) {
			return res
				.status(400)
				.json({ status: 'error', message: 'No comment provided' });
		}
		const createdAt = DateTime.now().toUTC();
		const fileID = uuidv4();
		await fileService.saveFileData(fileID, file.filename, comment, createdAt);
		res.status(201).json({
			status: 'success',
			message: 'File uploaded successfully',
			data: {
				fileID,
				filename: file.filename,
				comment,
				createdAt,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: `Error uploading file: ${error.message}`,
		});
	}
};

// GET ALL FILES
const getFileList = async (req, res, next) => {
	try {
		const files = await fileService.getFileList();
		res.status(200).json({
			status: 'success',
			message: 'Files retrieved successfully',
			data: files,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: `Error retrieving file: ${error.message}`,
		});
	}
};

// DOWNLOAD
const downloadFile = async (req, res, next) => {
	try {
		const { filename } = req.params;
		console.log(filename);
		const filePath = await fileService.getFilePath(filename);
		res.download(filePath, filename, (error) => {
			if (error) {
				console.error('Download error:', error);
				res.status(500).json({
					status: 'error',
					message: 'Error downloading file',
				});
			}
		});
	} catch (error) {
		console.error('File not found:', error);
		res.status(404).json({
			status: 'error',
			message: 'File not found',
		});
	}
};

module.exports = {
	handleFileUploadStart,
	handleFileUploadEnd,
	handleFileUploadChunk,
	handleClientDisconnect,
	uploadFileHttp,
	getFileList,
	downloadFile,
};
