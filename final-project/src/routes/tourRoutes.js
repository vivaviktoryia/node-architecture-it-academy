const express = require('express');

const {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getToursWithin,
	getDistances,
} = require('../controllers/tourController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
	.route('/')
	.get(getAllTours)
	.post(checkToken, restrictTo('admin'), createTour);

router
	.route('/:id')
	.get(getTour)
	.patch(checkToken, restrictTo('admin'), updateTour)
	.delete(checkToken, restrictTo('admin'), deleteTour);

// TODO
router.route('/top-5-cheap').get(aliasTopTours, getAllTours); // adding allias through middleware

router
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(getToursWithin);
// /tours-within/255/center/-45,40/unit/mi -----> req.params
// /tours-within?distance=255&center=-45,40&unit=mi -----> req.query

router.route('/distances/:latlng/unit/:unit').get(getDistances);

module.exports = router;
