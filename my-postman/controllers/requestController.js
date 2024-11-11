const axios = require('axios');
const path = require('path');
const { check, validationResult } = require('express-validator');

const {
	saveRequest,
	loadRequests,
	removeRequest,
} = require('../utils/requestStorage');
const requestsFilePath = path.resolve('data', 'savedRequests.json');

const getAllRequests = async (req, res, next) => {
	const savedRequests = await loadRequests(requestsFilePath);
	res.status(200).json({
		status: 'success',
		data: savedRequests,
	});
};

const getRequest = async (req, res, next) => {
	try {
		const savedRequests = await loadRequests(requestsFilePath);
		const requestId = req.params.requestId;

		const request = savedRequests.find((req) => req.id === requestId);

		if (!request) {
			return res.status(404).json({
				status: 404,
				statusText: 'Not Found',
				data: null,
				error: {
					message: 'Request not found.',
				},
			});
		}

		res.status(200).json({
			status: 200,
			statusText: 'OK',
			data: request,
			error: null,
		});
	} catch (error) {
		console.error('Error retrieving request:', error);
		res.status(500).json({
			status: 500,
			statusText: 'Internal Server Error',
			data: null,
			error: {
				message: 'An error occurred while retrieving the request.',
			},
		});
	}
};

const deleteRequest = async (req, res, next) => {
	try {
		const requestId = req.params.requestId;
		const savedRequests = await loadRequests(requestsFilePath);

		const requestIndex = savedRequests.findIndex((req) => req.id === requestId);

		if (requestIndex === -1) {
			return res.status(404).json({
				status: 404,
				statusText: 'Not Found',
				data: null,
				error: {
					message: 'Request not found.',
				},
			});
		}

		await removeRequest(requestIndex, requestsFilePath);

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting request:', error);
		res.status(500).json({
			status: 500,
			statusText: 'Internal Server Error',
			data: null,
			error: {
				message: 'An error occurred while deleting the request.',
			},
		});
	}
};

const validationRules = [
	check('url')
		.trim()
		.isString()
		.notEmpty()
		.withMessage('A URL is required.')
		.matches(
			/^(https?:\/\/)([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/,
		)
		.withMessage(
			'URL should start with http:// or https:// and contain only valid symbols.',
		),
	check('method')
		.customSanitizer((value) => value.toUpperCase())
		.trim()
		.isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
		.withMessage('A valid HTTP method is required.'),
];

const validateRequest = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: 400,
			statusText: 'Bad request',
			data: null,
			error: {
				message: 'Validation failed',
				details: errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				})),
			},
		});
	}
	next();
};

const createRequest = async (req, res, next) => {
	try {
		const { url, method, headers = {}, body } = req.body;
		const newRequest = {
			id: new Date().getTime().toString(),
			url,
			method,
			headers,
			body,
		};

		await saveRequest(newRequest, requestsFilePath);

		res.status(201).json({
			status: 201,
			statusText: 'Created',
			data: newRequest,
			error: null,
		});
	} catch (error) {
		console.error('Error saving request:', error);
		res.status(500).json({
			status: 500,
			statusText: 'Internal Server Error',
			data: null,
			error: {
				message: 'An error occurred while saving the request🤯',
			},
		});
	}
};

const sendRequest = async (req, res, next) => {
	try {
		const { url, method, headers = {}, body } = req.body;
		const response = await axios({
			method,
			url,
			headers,
			data: method === 'GET' ? undefined : body || {},
			maxRedirects: 0,
			timeout: 1000,
			responseType: 'arraybuffer',
			validateStatus: (status) => status < 500,
		});
		const responseBody = processResponseBody(response);
		res.status(200).json({
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			data: responseBody || null,
			error: null,
		});
	} catch (error) {
		handleError(error, res);
	}
};

const processResponseBody = (response) => {
	const contentType = response.headers['content-type'] || '';
	let responseBody = response.data;

	if (contentType.includes('application/json')) {
		try {
			responseBody = JSON.parse(response.data);
		} catch (error) {
			console.error('Error parsing JSON response');
			return res.status(422).json({
				status: 422,
				statusText: 'Error parsing JSON response',
				data: null,
				error: { message: error.message },
			});
		}
	} else if (
		contentType.includes('text/plain') ||
		contentType.includes('text/html')
	) {
		responseBody = response.data.toString('utf-8');
	} else if (contentType.includes('image') || contentType.includes('pdf')) {
		responseBody = Buffer.from(response.data, 'binary').toString('base64');
	} else if (!contentType.includes('text')) {
		responseBody = Buffer.from(response.data, 'binary').toString('base64');
	}

	return responseBody;
};

const handleProxyError = (error, res) => {
	let status = 502;
	let statusText = 'Bad Gateway - Unable to reach the target server';
	let errorMessage = error.message;
	let errorData = null;
	let errorHeaders = null;

	if (error.response) {
		status = error.response.status;
		statusText = error.response.statusText || 'Request failed';
		errorData = error.response.data.toString('utf-8');
		errorHeaders = error.response?.headers;
	}

	res.status(status).json({
		status,
		statusText,
		data: null,
		error: {
			message: errorMessage,
			details: errorData,
			headers: errorHeaders,
		},
	});
};

const handleValidationError = (error, res) => {
	let status = 422;
	let statusText = 'Unprocessable Entity';
	let errorMessage = 'Error parsing JSON response';
	let errorData = null;

	if (error instanceof SyntaxError) {
		errorMessage = error.message;
	} else {
		errorMessage = 'Invalid Request Data';
	}

	res.status(status).json({
		status,
		statusText,
		data: null,
		error: {
			message: errorMessage,
			details: errorData,
		},
	});
};

const handleError = (error, res) => {
	if (error.response || error.request) {
		handleProxyError(error, res);
	} else if (error instanceof SyntaxError || error instanceof Error) {
		handleValidationError(error, res);
	} else {
		console.error('Unknown Error:', error.message);
		res.status(500).json({
			status: 500,
			statusText: 'Internal Server Error',
			data: null,
			error: { message: 'An unexpected error occurred💥💥💥' },
		});
	}
};

module.exports = {
	getAllRequests,
	getRequest,
	deleteRequest,
	validationRules,
	validateRequest,
	createRequest,
	sendRequest,
};
