const express = require('express');

const {
	getOverview,
} = require('../controllers/viewsController');

const router = express.Router();

router.route('/').get(getOverview);
	
module.exports = router;
