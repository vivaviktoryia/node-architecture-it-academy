const express = require('express');

const {
	createLocation,
	getLocation,
	getAllLocations,
	updateLocation,
} = require('../controllers/locationController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(checkToken, restrictTo('admin'));

router.route('/').get(getAllLocations).post(createLocation);

router.route('/:id').get(getLocation).patch(updateLocation);

module.exports = router;
