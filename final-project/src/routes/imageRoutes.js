const express = require('express');

const {
	getAllImages,
	getImage,
	createImage,
} = require('../controllers/imageController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(checkToken, restrictTo('admin'));

router.route('/').get(getAllImages).post(createImage);

router.route('/:id').get(getImage);

module.exports = router;
