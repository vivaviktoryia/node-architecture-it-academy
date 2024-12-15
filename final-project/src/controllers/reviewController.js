const { Review  } = require('../models');

const userAttributes = ['id', 'name', 'role', 'photo', 'email'];
const tourAttributes = ['id', 'name', 'imageCover','ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price','summary', 'startDate' ];

const {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getAll,
} = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
	if (!req.body.tourId && req.params.tourId) {
		req.body.tourId = +req.params.tourId;
	}

	if (!req.body.userId) {
		req.body.userId = req.user.id;
	}
	next();
};

// GET - '/api/v1/tours/:tourId/reviews'
const getAllReviews = getAll(Review, {
	user: {
		model: 'User',
		as: 'user',
		foreignKey: 'userId',
		attributes: userAttributes,
	},
	tour: {
		model: 'Tour',
		as: 'tour',
		foreignKey: 'tourId',
		attributes: tourAttributes,
	},
});

const getReview = getOne(Review, {
	user: {
		model: 'User',
		as: 'user',
		foreignKey: 'userId',
		attributes: userAttributes,
	},
	tour: {
		model: 'Tour',
		as: 'tour',
		foreignKey: 'tourId',
		attributes: tourAttributes,
	},
});

// POST - '/api/v1/tours/:tourId/reviews'
const createReview = createOne(Review, {
	user: {
		model: 'User',
		as: 'user',
		foreignKey: 'userId',
		attributes: userAttributes,
	},
	tour: {
		model: 'Tour',
		as: 'tour',
		foreignKey: 'tourId',
		attributes: tourAttributes,
	},
});

const deleteReview = deleteOne(Review, {
	user: {
		model: 'User',
		as: 'user',
		foreignKey: 'userId',
	},
	tour: {
		model: 'Tour',
		as: 'tour',
		foreignKey: 'tourId',
	},
});

const updateReview = updateOne(Review, {
	user: {
		model: 'User',
		as: 'user',
		foreignKey: 'userId',
		attributes: userAttributes,
	},
	tour: {
		model: 'Tour',
		as: 'tour',
		foreignKey: 'tourId',
		attributes: tourAttributes,
	},
});

module.exports = {
	getReview,
	getAllReviews,
	createReview,
	setTourUserIds,
	deleteReview,
	updateReview,
};
