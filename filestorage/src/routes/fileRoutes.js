const express = require('express');
const { uploadMiddleware } = require('../services/fileService');
const {
	uploadFileHttp,
	getFileList,
	downloadFile,
} = require('../controllers/fileController');

const router = express.Router();

router.get('/', getFileList);
router.post('/', uploadMiddleware.single('file'), uploadFileHttp);
router.route('/:filename').get(downloadFile);

module.exports = router;
