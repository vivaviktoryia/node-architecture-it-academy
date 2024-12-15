const express = require('express');

const {
	getOverview,
	getTour,
	getLoginForm,
	getSignupForm,
	getAccount,
	manageTours,
	manageStructure,
} = require('../controllers/viewsController');
const { loadPlugins } = require('../controllers/pluginController');

const {
	getOverview_SSR,
	getTour_SSR,
	updateUserData_SSR,
} = require('../controllers/viewsController_SSR');

const {
	isLoggedIn,
	checkToken,
	restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.get('/me', checkToken, getAccount);

router.use(isLoggedIn);

router.get('/', loadPlugins, getOverview);
router.get('/overview', loadPlugins, getOverview);
router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

router.get('/admin/tours', checkToken, restrictTo('admin'), manageTours);
router.get('/admin/plugins', checkToken, restrictTo('admin'), manageStructure);

// SSR
// router.get('/ssr', getOverview_SSR);
// router.get('/ssr/tour/:slug', getTour_SSR);

module.exports = router;
