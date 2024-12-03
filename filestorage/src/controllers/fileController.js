const path = require('path');
const fs = require('fs');
const fileService = require('../services/fileService');
const { logError, logInfo } = require('../../utils/logger');
const AppError = require('../../utils/appError');

const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const uploadDir = path.resolve(__dirname, '../../uploads');
const activeUploads = new Map();

// UPLOAD via WS
const handleFileUploadStart = async (socket, data, cb) => {
	try {
		if (!data || !data?.fileName || !data?.totalSize || !data?.comment) {
			throw new AppError('Invalid upload start data', 400);
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
		await logInfo(`Sid ${socket.id}: Upload initialized`);
	} catch (error) {
		await logError('Error in fileUploadStart:', error);
		cb({ status: 'error', message: error.message });
	}
};

const handleFileUploadChunk = async (socket, chunk, cb) => {
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
			cb({ status: 'success', progress });
		});
	} catch (error) {
		cb({ status: 'error', message: 'Error writing file chunk' });
		await logError('Error writing file chunk');
	}
};

const handleFileUploadEnd = async (socket, cb) => {
	const upload = activeUploads.get(socket.id);

	if (!upload) {
		return cb({ status: 'error', message: 'Upload not initialized' });
	}

	const { writeStream, fileID, fileName, comment, uploadedBytes, totalSize } =
		upload;
	
	if (!writeStream || writeStream.writableEnded) {
		return cb({ status: 'error', message: 'Upload already finalized' });
	}

	if (uploadedBytes !== totalSize) {
		await logError(
			`File size mismatch for ${fileName}. Uploaded: ${uploadedBytes}, Expected: ${totalSize}`,
		);
		return cb({
			status: 'error',
			message: `File size mismatch. Uploaded: ${uploadedBytes}, Expected: ${totalSize}`,
		});
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
			await logInfo(`Sid ${socket.id}: File upload complete`);
			socket.disconnect();
		});
	} catch (error) {
		cb({ status: 'error', message: 'Error completing upload' });
		await logError('Error completing upload');
	}
};

const handleClientDisconnect = async (socket) => {
	try {
		const upload = activeUploads.get(socket.id);
		if (!upload) {
			return await logInfo(
				`Client disconnected with sid ${socket.id}, no active upload`,
			);
		}
		const { filePath, writeStream, uploadedBytes, totalSize } = upload;

		const deleteFile =  (path) => {
			fs.unlink(path, async  (err) => {
				if (err) {
					await logError(`Error deleting file ${path}:`, err);
				} else {
					await logInfo(`Successfully deleted file ${path}.`);
				}
			});
		};

		if (uploadedBytes !== totalSize) {
			await logError(
				`File size mismatch on disconnect for ${filePath}. Uploaded: ${uploadedBytes}, Expected: ${totalSize}`,
			);
			deleteFile(filePath);
		} else {
			writeStream.end(() => deleteFile(filePath));
		}

			// writeStream.end(() => {
			// 	fs.unlink(filePath, (err) => {
			// 		if (err) console.error(`Error deleting file ${filePath}:`, err);
			// 		else console.log(`Partially uploaded file ${filePath} deleted.`);
			// 	});
			// });

			activeUploads.delete(socket.id);
		
		await logInfo(`Client disconnected with sid ${socket.id}`);
	} catch (error) {
		console.error(`Error during client disconnection: ${error.message}`);
		await logError(`Error during client disconnection: ${error.message}`);
	}
};

// UPLOAD via HTTP
const uploadFileHttp = async (req, res, next) => {
	try {
		const { file } = req;
		const { comment } = req.body;

		if (!file) {
			throw new AppError('No file uploaded', 400);
		}
		if (!comment) {
			throw new AppError('No comment provided', 400);
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
		if (error instanceof AppError) {
			res.status(error.statusCode).json({
				status: 'error',
				message: error.message,
			});
		} else {
			res.status(500).json({
				status: 'error',
				message: `Error uploading file: ${error.message}`,
			});
		}
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
