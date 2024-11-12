const { check, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validationRules = [
	check('url')
		.trim()
		.isString()
		.notEmpty()
		.withMessage('A URL is required.')
		.matches(
			/^(https?:\/\/)([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/,
		)
		.withMessage(
			'URL should start with http:// or https:// and contain only valid symbols.',
		),
	check('method')
		.customSanitizer((value) => value.toUpperCase())
		.trim()
		.isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
		.withMessage('A valid HTTP method is required.'),
];

const validateRequest = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorDetails = errors.array().map((err) => ({
			field: err.path,
			message: err.msg,
		}));
		return next(
			new AppError('Validation failed', 400, {
				statusText: 'Bad request',
				details: errorDetails,
			}),
		);
	}
	next();
};

module.exports = { validationRules, validateRequest };
