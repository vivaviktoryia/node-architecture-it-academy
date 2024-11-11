const express = require('express');

const {
	getForm,
	submitForm,
	validationRules,
	getSuccess,
	getCustomForm,
	submitCustomForm,
} = require('../controllers/formController');

const router = express.Router();

router.route('/forms').get(getForm).post(validationRules, submitForm);
router.route('/forms/success').get(getSuccess);
router.route('/').get(getForm);

// CUSTOM
// router.route('/forms').get(getCustomForm).post(submitCustomForm);
// router.route('/').get(getCustomForm);

module.exports = router;
