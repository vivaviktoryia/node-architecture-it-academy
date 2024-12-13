const express = require('express');

const {
	getAllPlugins,
	getPlugin,
	createPlugin,
	updatePlugin,
} = require('../controllers/pluginController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(checkToken, restrictTo('admin'));

router.route('/').get(getAllPlugins).post(createPlugin);

router.route('/:id').get(getPlugin).patch(updatePlugin);

module.exports = router;
