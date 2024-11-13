const express = require('express');

const {
	getOverview,
} = require('../../src/controllers/viewsController');

const router = express.Router();

router.route('/').get(getOverview);
	
module.exports = router;
