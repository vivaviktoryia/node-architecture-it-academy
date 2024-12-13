const express = require('express');

const {
	getAllRequests,
	getRequest,
	deleteRequest,
	createRequest,
	sendRequest,
} = require('../controllers/requestController');

const { validationRules, validateRequest } = require('../services/validators');

const router = express.Router();

router
	.route('/')
	.get(getAllRequests)
	.post(validationRules, validateRequest, createRequest);
router.route('/review').post(validationRules, validateRequest, sendRequest);
router.route('/:requestId').get(getRequest).delete(deleteRequest);

module.exports = router;
