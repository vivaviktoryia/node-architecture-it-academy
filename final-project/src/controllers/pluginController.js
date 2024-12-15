const { Plugin, Page } = require('../models');
const { createOne, getOne, getAll, updateOne } = require('./handlerFactory');
const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

// GET
const getAllPlugins = getAll(Plugin);

const getPlugin = getOne(Plugin);

// POST
const createPlugin = createOne(Plugin);

// PATCH
const updatePlugin = updateOne(Plugin);

// MIDDLEWARE - currently only for 'overview' page
const loadPlugins = catchAsync(async (req, res, next) => {
		const pageName = 'overview';
		const page = await Page.findOne({ where: { name: pageName } });
		if (!page || !page.id) {
			return next(new AppError('Invalid page object', 400));
		}
		const plugins = await Plugin.findAll({
			include: [
				{
					model: Page,
					where: { id: page.id },
					as: 'pages',
					required: true,
					through: { attributes: [] },
				},
			],
			where: {
				active: true,
			},
			order: [['order', 'ASC']],
			attributes: ['id', 'type', 'content', 'order'],
		});
		res.locals.plugins = plugins;
		next();
	});

module.exports = {
	getAllPlugins,
	getPlugin,
	createPlugin,
	updatePlugin,
	loadPlugins,
};
