const multer = require('multer');
const { User } = require('../models/userModel');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

const imgPath = 'public/img/users';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgPath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

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

const allowedFields = ['name', 'email'];

const filterObj = (obj, fieldsToChange) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
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

 const user = await User.findByPk(req.user.id);

 if (!user) {
		return next(new AppError('User not found', 404));
 }

 // Update the user data
 const updatedRowsCount = await User.update(filteredBody, {
		where: { id: req.user.id },
 });

 if (updatedRowsCount[0] === 0) {
		return next(new AppError('User update failed', 400));
 }

 // Fetch the updated user data
 const updatedUser = await User.findByPk(req.user.id);

  res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
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
  deleteMe,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
};
