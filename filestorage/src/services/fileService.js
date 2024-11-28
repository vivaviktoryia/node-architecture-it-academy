const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const singleFileUpload = () => {
	return multer({ storage: storageConfig });
};

const getFileList = async () => {
	return await fs
		.readdir('uploads')
		.then((files) => files)
		.catch((err) => {
			throw new Error('Error reading file list: ' + err.message);
		});
};

const getFilePath = async (filename) => {
	const filePath = path.join(__dirname, '../uploads', filename);

	try {
		await fs.access(filePath);
		return filePath;
	} catch (err) {
		throw new Error('File not found');
	}
};

module.exports = { singleFileUpload, getFileList, getFilePath };
