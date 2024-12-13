const express = require('express');

const {
	getAllPages,
	getPage,
	createPage,
	updatePage,
} = require('../controllers/pageController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(checkToken, restrictTo('admin'));

router.route('/').get(getAllPages).post(createPage);

router.route('/:id').get(getPage).patch(updatePage);

module.exports = router;
