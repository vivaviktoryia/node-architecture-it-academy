const { Location } = require('../models/locationModel');
const { createOne, getOne, getAll, updateOne } = require('./handlerFactory');

// GET
const getAllLocations = getAll(Location);

const getLocation = getOne(Location);

// POST
const createLocation = createOne(Location);

// PATCH
const updateLocation = updateOne(Location);

module.exports = {
	createLocation,
	getAllLocations,
	getLocation,
	updateLocation,
};
