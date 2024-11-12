const { check, validationResult } = require('express-validator');

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
		return res.status(400).json({
			status: 400,
			statusText: 'Bad request',
			data: null,
			error: {
				message: 'Validation failed',
				details: errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				})),
			},
		});
	}
	next();
};

module.exports = { validationRules, validateRequest };
