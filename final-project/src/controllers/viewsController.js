// const getOverview = (req, res, next) => {
// 	res.render('overview');
// };

// module.exports = {
// 	getOverview,
// };

const { Tour } = require('../models/tourModel');
const { User } = require('../models/userModel');

const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

// const getOverview = catchAsync(async (req, res, next) => {
// 	// GET tour data
// 	const tours = await Tour.find();
// 	res.status(200).render('overview', {
// 		title: 'All Tours',
// 		tours,
// 	});
// });

const getOverview = (req, res, next) => {
	res.render('test');
};

const getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});
	if (!tour) {
		return next(new AppError('There is no Tour with that name!', 404));
	}
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' https://api.mapbox.com; style-src 'self' https://api.mapbox.com https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' https://api.mapbox.com data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.mapbox.com https://events.mapbox.com; worker-src 'self' blob:;",
		)
		.render('tour', {
			title: `${tour.name} Tour`,
			tour,
		});
});

const getLoginForm = catchAsync(async (req, res, next) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"script-src 'self' https://cdnjs.cloudflare.com",
		)
		.render('login', {
			title: 'Login',
		});
});

const getAccount = catchAsync(async (req, res, next) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
});

const getSignupForm = catchAsync(async (req, res, next) => {
	res.status(200).render('signup', {
		title: 'Sign up',
	});
});

// Utilized without API
const updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(200).render('account', {
		title: 'Your account',
		user: updatedUser,
	});
});

module.exports = {
	getOverview,
	getTour,
	getLoginForm,
	getSignupForm,
	getAccount,
	updateUserData,
};
