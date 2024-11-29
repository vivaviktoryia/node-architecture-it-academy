const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const iconv = require('iconv-lite');

const uploadDir = path.resolve(__dirname, '../../uploads');
const dataFilePath = path.resolve(
	uploadDir,
	'filesData.json',
);

const ensureUploadDir = async () => {
	try {
		await fsp.mkdir(uploadDir, { recursive: true });
	} catch (error) {
		throw new Error(`Failed to create upload directory: ${error.message}`);
	}
};

const readDataFile = async () => {
	try {
		const data = await fsp.readFile(dataFilePath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		return { files: [] };
	}
};

const writeDataFile = async (data) => {
	try {
		await fsp.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
	} catch (error) {
		throw new Error(`Failed to write to data file: ${error.message}`);
	}
};

const storageConfig = multer.diskStorage({
	destination: async (req, file, cb) => {
		try {
			await ensureUploadDir();
			cb(null, uploadDir);
		} catch (error) {
			cb(error);
		}
	},
	filename: (req, file, cb) => {
		// const uniqueName = `${Date.now()}-${file.originalname}`;
		const safeName = iconv.decode(
			Buffer.from(file.originalname, 'binary'),
			'utf8',
		);
		cb(null, safeName);
	},
});

const uploadMiddleware = multer({ storage: storageConfig });

const saveFileData = async (fileID, filename, comment, createdAt) => {
	const data = await readDataFile();

	const newFileData = { fileID, filename, comment, createdAt };
	data.files.push(newFileData);

	await writeDataFile(data);
};

const getFileList = async () => {
	try {
		const data = await readDataFile();
		return data.files;
	} catch (error) {
		throw new Error(`Error reading file list: ${error.message}`);
	}
};

const getFilePath = async (filename) => {
	const data = await readDataFile();
	const file = data.files.find((file) => file.filename === filename);
	if (!file) {
		throw new Error('File not found');
	}
	return path.resolve(uploadDir, file.filename);
};

module.exports = {
	uploadMiddleware,
	saveFileData,
	getFileList,
	getFilePath,
};
