const express = require('express');

// const {
//   getAllUsers,
//   getUser,
//   getMe,
//   createUser,
//   updateUser,
//   updateMe,
//   uploadUserPhoto,
//   deleteUser,
//   deleteMe,
// } = require('../controllers/userController');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  checkToken,
  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);
router.get('/logout', logout);

router.use(checkToken);

// router.patch('/updateMyPassword', updatePassword);
// router.get('/me', getMe, getUser);
// router.patch('/updateMe', uploadUserPhoto, updateMe);
// router.delete('/deleteMe', deleteMe);

// router.use(restrictTo('admin'));

// router.route('/').get(getAllUsers).post(createUser);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
