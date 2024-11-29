const { DateTime } = require('luxon');
const fileService = require('../services/fileService');
const { v4: uuidv4 } = require('uuid');

// UPLOAD
const uploadFile = async (req, res, next) => {
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
console.log(filePath);
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

module.exports = { uploadFile, getFileList, downloadFile };
