const { Tour } = require('../models/tourModel');
const { Location } = require('../models/locationModel');
const {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getAll,
} = require('./handlerFactory');

const { catchAsync } = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// MIDDLEWARE
const aliasTopTours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = 'ratingsAverage, price';
	req.query.fields = 'name,price,difficulty,ratingsAverage';
	next();
};

// GET
const getAllTours = getAll(Tour);
const getAllLocations = getAll(Location);

const getTour = getOne(Tour);

// POST
const createTour = createOne(Tour);

// PATCH
const updateTour = updateOne(Tour);

// DELETE
const deleteTour = deleteOne(Tour);

// TODO
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
  
	const tours = await Location.findAll({
		where: Sequelize.where(
			Sequelize.fn(
				'ST_Distance_Sphere',
				Sequelize.col('startLocation'),
				Sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`),
			),
			{ [Sequelize.Op.lte]: radius },
		),
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

	const distances = await Location.findAll({
		attributes: [
			'id', // Add other attributes you need
			'name',
			[
				Sequelize.fn(
					'ST_Distance_Sphere',
					Sequelize.col('startLocation'),
					Sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`),
				),
				'distance',
			],
		],
		where: Sequelize.where(
			Sequelize.fn(
				'ST_Distance_Sphere',
				Sequelize.col('startLocation'),
				Sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`),
			),
			{ [Sequelize.Op.gte]: 0 }, // Filter based on distance if necessary
		),
	});

	// Adjust the distances using the multiplier
	const adjustedDistances = distances.map((tour) => ({
		id: tour.id,
		name: tour.name,
		distance: tour.distance * multiplier,
	}));

	res.status(200).json({
		status: 'success',
		data: {
			data: adjustedDistances,
		},
	});
});


module.exports = {
	getAllTours,
	getToursWithin,
	getDistances,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getAllLocations,
};
