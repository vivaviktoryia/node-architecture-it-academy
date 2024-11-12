const { handleError } = require('../controllers/errorController');

const {
	saveRequest,
	loadRequests,
	removeRequest,
} = require('../utils/requestStorage');


const getAllRequestsService = async (filePath) => {
	return await loadRequests(filePath);
};

const getRequestByIdService = async (requestId, filePath) => {
	const savedRequests = await loadRequests(filePath);
	return savedRequests.find((req) => req.id === requestId);
};

const deleteRequestByIdService = async (requestId, filePath) => {
	const savedRequests = await loadRequests(filePath);
	const requestIndex = savedRequests.findIndex((req) => req.id === requestId);

	if (requestIndex === -1) {
		const error = {
			custom: true,
			status: 404,
			statusText: 'Not Found',
			message: 'Request not found.',
		};
		return handleError(error);
	}

	await removeRequest(requestIndex, filePath);
};

const createRequestService = async (newRequest, filePath) => {
	await saveRequest(newRequest, filePath);
};




module.exports = {
	getAllRequestsService,
	getRequestByIdService,
	deleteRequestByIdService,
	createRequestService,
};
