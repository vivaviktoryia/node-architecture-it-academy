const { logError } = require('../../utils/logger');

const sendError = (err, req, res, next) => {
	// A) API
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	// B) RENDERED WEBSITE
	console.error('ERROR 💥', err);
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong!',
		message: err.message,
		statusCode: err.statusCode,
	});
};

const globalErrorHandler = (err, req, res, next) => {
	// console.log(err.stack);

	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	logError(err);

	sendError(err, req, res);
};

module.exports = globalErrorHandler;
