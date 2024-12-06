const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} = require('../controllers/tourController');

const { checkToken, restrictTo } = require('../controllers/authController');

// const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.use('/:tourId/reviews', reviewRouter);

// for every parameter need to create its own middleware
// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours); // adding allias through middleware

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(checkToken, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
// /tours-within/255/center/-45,40/unit/mi -----> req.params
// /tours-within?distance=255&center=-45,40&unit=mi -----> req.query

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(checkToken, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(checkToken, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(checkToken, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
