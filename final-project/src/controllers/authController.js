const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const sendEmail = require('../../utils/email'); // for reset password

const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');
const userInfoFields = [
	'id',
	'name',
	'email',
	'photo',
	'role',
	'active',
	'createdAt',
	'updatedAt',
	'passwordChangedAt',
];

// Generate token
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user.id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
		),
		// secure: true,
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

const signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role,
	});

	const userData = {};
	userInfoFields.forEach((field) => {
		if (newUser[field] !== undefined) {
			userData[field] = newUser[field];
		}
	});

	createSendToken(userData, 201, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1. Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}
	// 2. Check if user exists and password is correct
	const user = await User.findOne({
		where: { email },
		attributes: ['password', ...userInfoFields],
	});

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	createSendToken(user, 200, res);
});

const logout = catchAsync(async (req, res, next) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({
		status: 'success',
	});
});

const checkToken = catchAsync(async (req, res, next) => {
	let token;
	// validate token in headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(
			new AppError('You are not logged in! Please log in to get access!', 401),
		);
	}

	// 2. Verification token - error handling supports in errorController
	const decodedToken = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET,
  );
   
	// 3. Check if user still exists
  const currentUser = await User.findByPk(decodedToken.id);

	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist.',
				401,
			),
		);
	}

	// 4. Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decodedToken.iat)) {
		return next(
			new AppError('User recently changed password! Please log in again.', 401),
		);
	}
	req.user = currentUser; // provide access to restrictTo method req.user
	res.locals.user = currentUser;
	next();
});

// Only for rendered pages, no errors
const isLoggedIn = async (req, res, next) => {
	// Verify token
	if (req.cookies.jwt) {
		try {
			const decodedToken = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET,
			);
			// Check if user still exists
			const currentUser = await User.findByPk(decodedToken.id);
			if (!currentUser) {
				return next();
			}

			// Check if user changed password after the token was issued
			if (currentUser.changedPasswordAfter(decodedToken.iat)) {
				return next();
			}
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};

const restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You don'nt have permission to perform this action!", 403),
			);
		}
		next();
	};

const forgotPassword = catchAsync(async (req, res, next) => {
	// GET User based on POSTed email
	const user = await User.findOne({ where: { email: req.body.email } });
	if (!user) {
		return next(new AppError('There is no User with email address.', 404));
	}
	// Generate random reset TOKEN
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// Send it to user's email
	const resetURL = `${req.protocol}://${req.get(
		'host',
	)}/api/v1/users/resetPassword/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password , please ignore this email!`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Password reset token (valid for 10 min)',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
			resetToken, // for testing purpose
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an Error sending the email. Try again later!',
				500,
			),
		);
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	// GET User based on the token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');

	const user = await User.findOne({
		where: {
			passwordResetToken: hashedToken,
			passwordResetExpires: { [Sequelize.Op.gt]: Date.now() },
		},
	});

	// Set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired!', 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
	// 1. Get user from collection
	const user = await User.findByPk(req.user.id, {
		attributes: ['password', 'id', 'name', 'email', 'photo', 'role', 'active'],
	});

	// 2. Check if POSTed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Current password is wrong!', 401));
	}
	// 3. If so , update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save(); // save changes into db

	// 4. Log user in , send JWT
	createSendToken(user, 200, res);
});

module.exports = {
	signup,
	login,
	logout,
	checkToken,
	restrictTo,
	forgotPassword,
	resetPassword,
	updatePassword,
	isLoggedIn,
};
