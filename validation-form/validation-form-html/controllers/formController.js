const path = require('path');

const { check, validationResult } = require('express-validator');
const pageFilePath = path.resolve(__dirname, '..', 'public', 'form.html');

const {
	removeHtml,
	renderHtml,
	composeForm,
	composeSuccess,
} = require('../utils/htmlUtils');

const getForm = async (req, res, next) => {
	const formReplacements = {
		'#TITLE': 'Form Page',
		'#CONTENT': composeForm({}, null),
	};

	try {
		const html = await renderHtml(formReplacements, pageFilePath);
		res.send(html);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

const validationRules = [
	check('name')
		.trim()
		.notEmpty()
		.withMessage('Name is required')
		.isLength({ min: 2, max: 50 })
		.withMessage('Name should be between 2 and 50 characters')
		.matches(/^[A-Za-z\s]+$/)
		.withMessage('Name can only contain letters and spaces'),

	check('email')
		.isEmail()
		.withMessage('Invalid email address')
		.notEmpty()
		.withMessage('Email is required')
		.normalizeEmail()
		.isLength({ min: 5, max: 50 })
		.withMessage('Email should be between 5 and 50 characters'),
];

const submitForm = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const formReplacements = {
			'#TITLE': 'Form Page',
			'#CONTENT': composeForm(req.body, errors),
		};
		const html = await renderHtml(formReplacements, pageFilePath);
		return res.status(400).send(html);
	}
	req.session.successData = req.body;

	res.redirect(303, '/forms/success');
};

const getSuccess = async (req, res, next) => {
	const values = req.session.successData;

	if (!values) {
		return res.redirect(303, '/');
	}

	const successReplacements = {
		'#TITLE': 'Form Result',
		'#CONTENT': composeSuccess(values),
	};
	try {
		const resultPageHtml = await renderHtml(successReplacements, pageFilePath);
		// req.session.successData = null;
		res.send(resultPageHtml);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

const getCustomForm = async (req, res, next) => {
	res.send(composeForm({}, null));
};

const submitCustomForm = async (req, res, next) => {
	const sanitizedBody = {
		name: removeHtml(req.body.name || ''),
		email: removeHtml(req.body.email || ''),
	};
	const errs = [];

	if (!sanitizedBody.name) {
		errs.push({
			value: sanitizedBody.name || '',
			msg: 'Name is required',
			path: 'name',
		});
	}
	if (!sanitizedBody.email) {
		errs.push({
			value: sanitizedBody.email || '',
			msg: 'Email is required',
			path: 'email',
		});
	}
	if (errs.length > 0) {
		res.status(400).send(composeForm(sanitizedBody, errs));
	} else {
		req.session.successData = req.body;
		res.redirect(303, '/forms/success');
	}
};

module.exports = {
	getForm,
	submitForm,
	validationRules,
	getCustomForm,
	submitCustomForm,
	getSuccess,
};
