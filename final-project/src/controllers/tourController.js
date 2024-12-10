const { Tour, Location, Image } = require('../models');

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
const getAllTours = getAll(Tour, {
	images: { model: 'Image', through: true, attributes: ['id', 'fileName'] },
	locations: {
		model: 'Location',
		through: true,
		attributes: ['id', 'description', 'coordinates'],
	},
});

const getTour = getOne(Tour, {
	images: { model: 'Image', through: true, attributes: ['id', 'fileName'] },
	locations: {
		model: 'Location',
		through: true,
		attributes: ['id', 'description', 'coordinates'],
	},
});

// POST
const createTour = createOne(Tour, {
	images: {
		model: 'Image',
		required: true,
		minLength: 3,
		attributes: ['id', 'fileName'],
	},
	locations: {
		model: 'Location',
		required: true,
		minLength: 1,
		attributes: ['id', 'description', 'coordinates'],
	},
});

// PATCH
const updateTour = updateOne(Tour, {
	images: {
		model: 'Image',
		through: true,
		minLength: 3,
		attributes: ['id', 'fileName'],
	},
	locations: {
		model: 'Location',
		through: true,
		minLength: 1,
		attributes: ['id', 'description', 'coordinates'],
	},
});

// DELETE
const deleteTour = deleteOne(Tour, {
	images: { model: 'Image', as: 'images', deleteAssociated: false },
	locations: {
		model: 'Location',
		as: 'locations',
		deleteAssociated: false,
	},
});

module.exports = {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
};
