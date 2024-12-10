const { Tour, User, Location, Image, Review } = require('../models');

const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

const getOverview_SSR = catchAsync(async (req, res, next) => {
	// GET tour data
	const tours = await Tour.findAll({
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
			},
			{
				model: Review,
				as: 'reviews',
				required: false,
			},
		],
	});
	res.status(200).render('overview_SSR', {
		title: 'All Tours',
		tours,
	});
});

const getTour_SSR = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({
		where: { slug: req.params.slug },
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
			},
			{
				model: Review,
				as: 'reviews',
				// 	attributes: ['review', 'rating', 'user'], // Select specific fields to include
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['name', 'photo'], // Укажите необходимые поля
					},
				],
				required: false,
			},
		],
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
		.render('tour_SSR', {
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
const updateUserData_SSR = catchAsync(async (req, res, next) => {
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

	res.status(200).render('account_SSR', {
		title: 'Your account',
		user: updatedUser,
	});
});

module.exports = {
	getOverview_SSR,
	getTour_SSR,
	// getLoginForm,
	// getSignupForm,
	// getAccount,
	updateUserData_SSR,
};
