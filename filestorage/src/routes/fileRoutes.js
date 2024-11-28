const express = require('express');
const {
	handleFileUpload,
	getFileList,
	downloadFile,
} = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', handleFileUpload);

router.get('/files', getFileList);

router.get('/download/:filename', downloadFile);

module.exports = router;
