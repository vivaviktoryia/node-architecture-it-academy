const express = require('express');

const {
	getForm,
	submitForm,
	validationRules,
	getSuccess,
} = require('../controllers/formController');

const router = express.Router();

router.route('/forms').get(getForm).post(validationRules, submitForm);
router.route('/forms/success').get(getSuccess);
router.route('/').get(getForm);

module.exports = router;
