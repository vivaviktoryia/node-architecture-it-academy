const AppError = require('../../utils/appError');

const {
	saveRequest,
	loadRequests,
	removeRequest,
} = require('../../utils/requestStorage');

// const getAllRequestsService = async (filePath) => {
// 	return await loadRequests(filePath);
// };

const getAllRequestsService = async (filePath) => {
	try {
		const requests = await loadRequests(filePath);
		return requests;
	} catch (error) {
		return new AppError('Error loading requests from the file', 500);
	}
};

// const getRequestByIdService = async (requestId, filePath) => {
// 	const savedRequests = await loadRequests(filePath);
// 	return savedRequests.find((req) => req.id === requestId);
// };

const getRequestByIdService = async (requestId, filePath) => {
	try {
		const savedRequests = await loadRequests(filePath);
		const request = savedRequests.find((req) => req.id === requestId);
		if (!request) {
			return new AppError('Request not found', 404);
		}
		return request;
	} catch (error) {
		return new AppError(
			error.message || 'Failed to retrieve request by ID',
			500,
		);
	}
};

// const deleteRequestByIdService = async (requestId, filePath) => {
// 	const savedRequests = await loadRequests(filePath);
// 	const requestIndex = savedRequests.findIndex((req) => req.id === requestId);

// 	if (requestIndex === -1) {
// 		return new AppError('Request not found', 404, {
// 			statusText: 'Not Found',
// 		});
// 	}

// 	await removeRequest(requestIndex, filePath);
// };

const deleteRequestByIdService = async (requestId, filePath) => {
	try {
		const savedRequests = await loadRequests(filePath);
		const requestIndex = savedRequests.findIndex((req) => req.id === requestId);

		if (requestIndex === -1) {
			return new AppError('Request not found', 404);
		}

		await removeRequest(requestIndex, filePath);
	} catch (error) {
		return new AppError(error.message || 'Failed to delete request', 500);
	}
};

// const createRequestService = async (newRequest, filePath) => {
// 	await saveRequest(newRequest, filePath);
// };

const createRequestService = async (newRequest, filePath) => {
	try {
		await saveRequest(newRequest, filePath);
	} catch (error) {
		return new AppError('Failed to create request', 500);
	}
};

module.exports = {
	getAllRequestsService,
	getRequestByIdService,
	deleteRequestByIdService,
	createRequestService,
};
