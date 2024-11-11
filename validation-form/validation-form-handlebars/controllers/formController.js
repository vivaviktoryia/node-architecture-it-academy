const { check, validationResult } = require('express-validator');

const {  escapeHtml } = require('../utils/htmlUtils');

const getForm = async (req, res, next) => {
	try {
		res.render('form', {
			layout: 'main',
			title: 'Form Page',
			values: {},
			errorMessage: null,
		});
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
	const { name, email } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		let errorMessage = '';
		if (Array.isArray(errors)) {
			errorMessage = errors?.map((err) => err.msg).join(', ');
		} else if (typeof errors === 'object' && errors !== null) {
			errorMessage = errors
				?.array()
				.map((err) => err.msg)
				.join(', ');
		}
		res.status(400).render('form', {
			layout: 'main',
			title: 'Form Page',
			values: { name: escapeHtml(name) || '', email: escapeHtml(email) || '' },
			errorMessage,
		});
	} else {
		req.session.successData = req.body;
		res.redirect(303, '/forms/success');
	}
};

const getSuccess = async (req, res, next) => {
	const values = req.session.successData;

	if (!values) {
		return res.redirect(303, '/');
	}

	try {
		res.render('success', {
			layout: 'main',
			title: 'Success',
			values: {
				name: escapeHtml(values.name) || '',
				email: escapeHtml(values.email) || '',
			},
		});
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

module.exports = {
	getForm,
	submitForm,
	validationRules,
	getSuccess,
};
