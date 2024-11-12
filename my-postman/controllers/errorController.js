const handleProxyError = (error) => {
	let status = error.response?.status || 502;
	let statusText =
		error.response?.statusText ||
		'Bad Gateway - Unable to reach the target server';
	let errorMessage = error.message;
	let errorData = error.response?.data?.toString('utf-8') || null;
	let errorHeaders = error.response?.headers || null;
	return {
		status,
		statusText,
		message: errorMessage,
		details: errorData,
		headers: errorHeaders,
	};
};

const handleValidationError = (error) => {
	let status = 422;
	let statusText = 'Unprocessable Entity';
	let errorMessage =
		error instanceof SyntaxError ? error.message : 'Invalid Request Data';
	return { status, statusText, message: errorMessage };
};

const handleServerError = (error) => {
	const status = 500;
	const statusText = 'Internal Server Error';
	const errorMessage = error?.message
		? error.message
		: 'An unexpected error occurred';

	return { status, statusText, message: errorMessage };
};

const handleCustomError = (error) => {
	const status = error.status || 500;
	const statusText = error?.statusText ? error.statusText : 'Smth went wrong💥';
	const errorMessage = error?.message
		? error.message
		: 'An unexpected error occurred';
	const headers = error.headers || null;

	return { status, statusText, message: errorMessage, headers };
};

const handleError = (error, res) => {
	let errorResponse;

	if (error.custom) {
		errorResponse = handleCustomError(error);
	} else if (error.response || error.request) {
		errorResponse = handleProxyError(error);
	} else if (error instanceof SyntaxError || error instanceof Error) {
		errorResponse = handleValidationError(error);
	} else {
		errorResponse = handleServerError(error);
	}

	console.error('Error💥💥💥:', error.message);

	const { status, statusText, message, details, headers } = errorResponse;
	sendErrorResponse(res, status, statusText, message, details, headers);
};

const sendErrorResponse = (
	res,
	status,
	statusText,
	message,
	details = null,
	headers = null,
) => {
	res.status(status).json({
		status,
		statusText,
		data: null,
		error: {
			message,
			details,
			headers,
		},
	});
};

module.exports = {
	handleError,
};
