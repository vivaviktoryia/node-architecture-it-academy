const AppError = require('../../utils/appError');

const handleProxyError = (error) => {
	let status = error.response?.status || 502;
	let statusText =
		error.response?.statusText ||
		'Bad Gateway - Unable to reach the target server';
	let errorMessage = error.message;
	let errorData = error.response?.data?.toString('utf-8') || null;
	let errorHeaders = error.response?.headers || null;

	return new AppError(errorMessage, status, {
		statusText,
		details: errorData,
		headers: errorHeaders,
	});
};

const handleCustomError = (error) => {
	const status = error.status || 500;
	const statusText = error?.statusText
		? error.statusText
		: 'Internal Server Error';
	const errorMessage = error?.message
		? error.message
		: 'An unexpected error occurred💥💥💥';
	const headers = error.headers || null;
	const details = error.details || null;

	return new AppError(errorMessage, status, {
		statusText,
		headers,
		details,
	});
};

const globalErrorHandler = (error, req, res, next) => {
	let errorResponse;

	if (error.response || error.request) {
		errorResponse = handleProxyError(error);
	} else {
		errorResponse = handleCustomError(error);
	}

	sendError(errorResponse, req, res);
};

const sendError = (err, req, res) => {
	const { status, statusText, message, details, headers } = err;

	if (req.originalUrl.startsWith('/api')) {
		return res.status(status).json({
			status,
			statusText,
			data: null,
			error: {
				message,
				details,
				headers,
			},
		});
	}
	console.error('ERROR 💥', err);
	return res.status(status).render('error', {
		title: 'Something went wrong!',
		message,
		status,
	});
};

module.exports = { globalErrorHandler };
