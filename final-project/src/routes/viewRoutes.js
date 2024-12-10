const express = require('express');

const {
	getOverview,
	getTour,
	getLoginForm,
	getSignupForm,
	getAccount,
	// updateUserData,
} = require('../controllers/viewsController');

const {
	getOverview_SSR,
	getTour_SSR,
	updateUserData_SSR,
} = require('../controllers/viewsController_SSR');

const { isLoggedIn, checkToken } = require('../controllers/authController');

const router = express.Router();

router.get('/me', checkToken, getAccount);

// with API
// router.post('/submit-user-data', checkToken, updateUserData);

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

// SSR
router.get('/ssr', getOverview_SSR);
// router.get('/tour/:slug', getTour_SSR);

module.exports = router;
