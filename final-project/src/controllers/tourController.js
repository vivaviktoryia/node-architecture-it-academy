const Tour = require('../models/tourModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

// const APIFeatures = require('../utils/apiFeatures');

const { catchAsync } = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// MIDDLEWARE
const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,difficulty,ratingsAverage';
  next();
};

// GET
const getAllTours = getAll(Tour);

const getTour = getOne(Tour, {
  path: 'reviews',
  select: 'review', // Specify the fields you want to include
});

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const normalizedUnit = unit.toLowerCase().trim();

  if (!lat || !lng) {
    return next(
      new AppError('No coords specified in the format lat,lng!', 400),
    );
  }

  if (normalizedUnit !== 'mi' && normalizedUnit !== 'km') {
    return next(
      new AppError('Wrong unit of measure specified! Allowed: km, mi.', 400),
    );
  }

  const radius =
    normalizedUnit === 'mi' ? distance / 3963.2 : distance / 6378.1; // distance / radious of Earth (mi or km)

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const normalizedUnit = unit.toLowerCase().trim();

  if (!lat || !lng) {
    return next(
      new AppError('No coords specified in the format lat,lng!', 400),
    );
  }

  if (normalizedUnit !== 'mi' && normalizedUnit !== 'km') {
    return next(
      new AppError('Wrong unit of measure specified! Allowed: km, mi.', 400),
    );
  }

  const multiplier = normalizedUnit === 'mi' ? 0.000621371 : 0.001;

  // needs to have index in schema
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

// POST
const createTour = createOne(Tour);

// PATCH
const updateTour = updateOne(Tour);

// DELETE
const deleteTour = deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$difficulty',
        // _id: null,
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $project: {
        numTours: 1, // means that will include in output
        numRatings: 1,
        avgRating: { $round: ['$avgRating', 1] }, // Round to 1 decimal place
        avgPrice: { $round: ['$avgPrice', 2] }, // Round to 2 decimal places
        minPrice: 1,
        maxPrice: 1,
      },
    },
    {
      $sort: {
        numTours: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // decompose eevery element of array - generate separate documents
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

module.exports = {
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};
