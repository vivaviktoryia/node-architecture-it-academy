const path = require('path');

const {
	saveRequest,
	loadRequests,
	removeRequest,
} = require('../../utils/requestStorage');
const requestsFilePath = path.resolve('data', 'savedRequests.json');

const getOverview = async (req, res, next) => {
	const savedRequests = await loadRequests(requestsFilePath);
	res.render('overview', { savedRequests });
};

module.exports = {
	getOverview,
};
