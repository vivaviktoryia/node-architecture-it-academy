const axios = require('axios');
const path = require('path');

const AppError = require('../../utils/appError');

const {
	getAllRequestsService,
	getRequestByIdService,
	deleteRequestByIdService,
	createRequestService,
} = require('../services/requestService');

const requestsFilePath = path.resolve('data', 'savedRequests.json');

const getAllRequests = async (req, res, next) => {
	try {
		const savedRequests = await getAllRequestsService(requestsFilePath);
		res.status(200).json({
			status: 'success',
			data: savedRequests,
		});
	} catch (error) {
		return next(new AppError('Failed to retrieve requests', 500));
	}
};

const getRequest = async (req, res, next) => {
	try {
		const { requestId } = req.params;

		if (!requestId) {
			return next(new AppError('Request ID is required', 400));
		}

		const request = await getRequestByIdService(requestId, requestsFilePath);

		if (!request) {
			return next(
				new AppError('Request not found', 404, {
					statusText: 'Not Found',
				}),
			);
		}

		res.status(200).json({
			status: 200,
			statusText: 'OK',
			data: request,
			error: null,
		});
	} catch (error) {
		return next(
			new AppError('An error occurred while retrieving the request', 500),
		);
	}
};

const deleteRequest = async (req, res, next) => {
	try {
		const { requestId } = req.params;
		await deleteRequestByIdService(requestId, requestsFilePath);
		res.status(204).send();
	} catch (error) {
		return next(
			new AppError('An error occurred while deleting the request', 500),
		);
	}
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

		await createRequestService(newRequest, requestsFilePath);

		res.status(201).json({
			status: 201,
			statusText: 'Created',
			data: newRequest,
			error: null,
		});
	} catch (error) {
		return next(
			new AppError('An error occurred while saving the request', 500),
		);
	}
};

const sendRequest = async (req, res, next) => {
	try {
		const { url, method, headers = {}, body } = req.body;
		const response = await sendHttpRequest(url, method, headers, body);
		const responseBody = processResponseBody(response);
		res.status(200).json({
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			data: responseBody || null,
			error: null,
		});
	} catch (error) {
		if (error.response) {
			return next(error);
		} else {
			return next(new AppError('Failed to send the HTTP request', 500));
		}
	}
};

const sendHttpRequest = async (url, method, headers, body) => {
	return await axios({
		method,
		url,
		headers,
		data: method === 'GET' ? undefined : body || {},
		maxRedirects: 0,
		timeout: 1000,
		responseType: 'arraybuffer',
		validateStatus: (status) => status < 500,
	});
};

const processResponseBody = (response) => {
	const contentType = response.headers['content-type'] || '';

	if (contentType.includes('application/json')) {
		return safelyParseJson(response.data);
	}

	if (contentType.includes('text/') || contentType.includes('text/html')) {
		return response.data.toString('utf-8');
	}

	return Buffer.from(response.data, 'binary').toString('base64');
};

const safelyParseJson = (data, res) => {
	try {
		return JSON.parse(data);
	} catch (error) {
		return next(new AppError('Failed to send the HTTP request', 500));
	}
};

module.exports = {
	getAllRequests,
	getRequest,
	deleteRequest,
	createRequest,
	sendRequest,
};
