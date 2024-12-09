const { Image } = require('../models/imageModel');
const { createOne, getOne, getAll } = require('./handlerFactory');


// GET
const getAllImages = getAll(Image);

const getImage = getOne(Image);

// POST
const createImage = createOne(Image);


module.exports = {
	getAllImages,
	getImage,
	createImage,
};
