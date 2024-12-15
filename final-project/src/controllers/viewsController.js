const {
	Tour,
	User,
	Location,
	Image,
	Review,
	Plugin,
	Page,
} = require('../models');
const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
	res.status(200).render('overview', {
		title: 'All Tours',
	});
});

const getTour = catchAsync(async (req, res, next) => {
	const { slug } = req.params;
	const sanitazedSlug = slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' https://api.mapbox.com; style-src 'self' https://api.mapbox.com https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' https://api.mapbox.com data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.mapbox.com https://events.mapbox.com; worker-src 'self' blob:;",
		)
		.render('tour', {
			title: `Tour ${sanitazedSlug}`,
			slug: slug,
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
		title: 'Your Account',
	});
});

const getSignupForm = catchAsync(async (req, res, next) => {
	res.status(200).render('signup', {
		title: 'Sign Up',
	});
});

const manageTours = catchAsync(async (req, res, next) => {
	const locations = await Location.findAll({
		attributes: ['id', 'description'],
	});
	const images = await Image.findAll({ attributes: ['id', 'fileName'] });

	res.status(200).render('admin', {
		title: 'Manage Tours',
		page: 'manageTours',
		images: images || [],
		locations: locations || [],
		plugins: [],
	});
});

const manageStructure = catchAsync(async (req, res, next) => {
	const plugins = await Plugin.findAll({
		where: { active: true },
		attributes: ['id','type', 'content', 'order'],
		order: [['order', 'ASC']],
	});
	const pluginData = plugins.map((plugin) => plugin.dataValues);
	console.log(pluginData);
	res.status(200).render('admin', {
		title: 'Manage Structure',
		page: 'manageStructure',
		plugins: pluginData,
		images: [],
		locations: [],
	});
});

module.exports = {
	getOverview,
	getTour,
	getLoginForm,
	getSignupForm,
	getAccount,
	manageTours,
	manageStructure,
};
