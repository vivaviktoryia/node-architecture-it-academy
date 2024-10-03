const sendError = (err, req, res) => {
	console.error('ERROR 💥', err);
	return res.status(err.statusCode).render('error', {
		statusCode: err.statusCode,
		message: err.message,
	});
};

const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	sendError(err, req, res);
};

module.exports = globalErrorHandler;
