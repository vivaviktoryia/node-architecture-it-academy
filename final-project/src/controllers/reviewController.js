const {Review} = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// GET - '/api/v1/tours/:tourId/reviews'
const getAllReviews = getAll(Review);
const getReview = getOne(Review);

// POST - '/api/v1/tours/:tourId/reviews'
const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  getReview,
  getAllReviews,
  createReview,
  setTourUserIds,
  deleteReview,
  updateReview,
};
