const express = require('express');

const {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourBySlug,
} = require('../controllers/tourController');

const { checkToken, restrictTo } = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
	.route('/')
	.get(getAllTours)
	.post(checkToken, restrictTo('admin'), createTour);

router
	.route('/:id')
	.get(getTour)
	.patch(checkToken, restrictTo('admin'), updateTour)
	.delete(checkToken, restrictTo('admin'), deleteTour);

router.route('/slug/:slug').get(getTourBySlug);

// TODO
router.route('/top-5-cheap').get(aliasTopTours, getAllTours); // adding allias through middleware

module.exports = router;
