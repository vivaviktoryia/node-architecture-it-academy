const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const { User } = require('../models');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

const uploadFolder = path.join(__dirname, '../../public/img/users');
// const uploadFolder = 'public/img/users';

// UPLOAD IN FOLDER
// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, uploadFolder);
// 	},
// 	filename: (req, file, cb) => {
// 		const ext = file.mimetype.split('/')[1];
// 		cb(null, `user-${req.user.id}.${ext}`);
// 	},
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Pls upload only images!', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo'); // 'photo' - fieldName

const processUserPhoto = async (req, res, next) => {
	try {
		if (!req.file) return next();

		const originalFilename = `original-user-${req.user.id}.jpeg`;
		const profileFilename = `user-${req.user.id}.jpeg`;

		await sharp(req.file.buffer).toFile(
			path.join(uploadFolder, `./original/${originalFilename}`),
		);

		await sharp(req.file.buffer)
			.resize(128, 128)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toFile(path.join(uploadFolder, profileFilename));

		// req.file.originalFilename = originalFilename;
		req.file.profileFilename = profileFilename;

		next();
	} catch (error) {
		next(error);
	}
};

const allowedFields = ['name', 'email'];

const filterObj = (obj, fieldsToChange) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (fieldsToChange.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

// GET
const getAllUsers = getAll(User);
const getUser = getOne(User);

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

// POST
const createUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /signup instead!',
	});
};

// PATCH
const updateUser = updateOne(User);

const updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword',
				400,
			),
		);
	}

	const filteredBody = filterObj(req.body, allowedFields);
	if (req.file) filteredBody.photo = req.file.profileFilename;

	const user = await User.findByPk(req.user.id);

	if (!user) {
		return next(new AppError('User not found', 404));
	}

	// Update the user data
	const updatedUser = await User.update(filteredBody, {
		where: { id: req.user.id },
		returning: true,
	});

	if (!updatedUser[1]) {
		return next(new AppError('User update failed', 400));
	}

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser[1][0],
		},
	});
});

// DELETE
const deleteUser = deleteOne(User);

const deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

module.exports = {
	getAllUsers,
	updateMe,
	uploadUserPhoto,
	processUserPhoto,
	deleteMe,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	getMe,
};
