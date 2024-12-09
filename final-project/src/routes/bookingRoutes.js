const express = require('express');

const {
	createBooking,
} = require('../controllers/bookingController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

// router.post('/', checkToken, restrictTo('user'), createBooking);
router.post('/',  createBooking);

module.exports = router;
