// POST
const createBooking = (req, res, next) => {
	res.status(409).json({
		status: 'error',
		message: 'No spots available for booking at the moment!',
	});
};

module.exports = {
	createBooking,
};
