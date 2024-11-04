const express = require('express');

const { handleNotFound } = require('../controllers/errorController');

const router = express.Router();

router.route('*').all(handleNotFound);

module.exports = router;
