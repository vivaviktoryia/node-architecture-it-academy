const express = require('express');
const { uploadMiddleware } = require('../services/fileService');
const {
	uploadFile,
	getFileList,
	downloadFile,
} = require('../controllers/fileController');

const router = express.Router();

router.get('/', getFileList);
router.post('/', uploadMiddleware.single('file'), uploadFile);
router.route('/:filename').get(downloadFile);

module.exports = router;
