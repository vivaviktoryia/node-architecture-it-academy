const fileService = require('../services/fileService');

const handleFileUpload = (req, res, next) => {
	fileService.singleFileUpload().single('file')(req, res, (err) => {
		if (err) {
			return next(err);
		}

		res.json({
			message: 'File uploaded successfully!',
			filename: req.file.filename,
		});
	});
};

const getFileList = async (req, res) => {
	try {
		const files = await fileService.getFileList();
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const downloadFile = async (req, res) => {
	const { filename } = req.params;

	try {
		const filePath = await fileService.getFilePath(filename);

		res.download(filePath, filename, (err) => {
			if (err) {
				console.log('Download error:', err);
				res.status(500).send('Error downloading file');
			}
		});
	} catch (err) {
		console.log('File not found:', err);
		res.status(404).send('File not found');
	}
};

module.exports = { handleFileUpload, getFileList, downloadFile };
