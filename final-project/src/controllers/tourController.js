const { Tour, Location, Image, Review, User } = require('../models');

const {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getOneBySlug,
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

// GET ALL TOURS
const getAllTours = getAll(Tour, {
	images: { model: 'Image', through: true, attributes: ['id', 'fileName'] },
	locations: {
		model: 'Location',
		through: true,
		attributes: ['id', 'description', 'coordinates'],
	},
});

// GET TOUR BY ID
const getTour = getOne(Tour, {
	images: { model: 'Image', through: true, attributes: ['id', 'fileName'] },
	locations: {
		model: 'Location',
		through: true,
		attributes: ['id', 'description', 'coordinates'],
	},
}, 'id');

// GET TOUR BY SLUG
const getTourBySlug = catchAsync(async (req, res, next) => {
	const { slug } = req.params;
	const tour = await Tour.findOne({
		where: { slug },
		include: [
			{
				model: Location,
				as: 'locations',
				required: false,
			},
			{
				model: Image,
				as: 'images',
				required: false,
				// attributes: ['fileName'],
			},
			{
				model: Review,
				as: 'reviews',
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['name', 'photo'],
					},
				],
				required: false,
			},
		],
	});

	if (!tour) {
		return next(new AppError('There is no Tour with that name!', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
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
	getTourBySlug,
	updateTour,
	deleteTour,
	aliasTopTours,
};
