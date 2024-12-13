const { Page } = require('../models');
const { createOne, getOne, getAll, updateOne } = require('./handlerFactory');

// GET
const getAllPages = getAll(Page);

const getPage = getOne(Page);

// POST
const createPage = createOne(Page);

// PATCH 
const updatePage = updateOne(Page);

module.exports = {
	getAllPages,
	getPage,
	createPage,
	updatePage,
};
