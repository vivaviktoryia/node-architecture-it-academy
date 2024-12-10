const express = require('express');

const {
	getReview,
	getAllReviews,
	createReview,
	setTourUserIds,
	deleteReview,
	updateReview,
} = require('../controllers/reviewController');

const { checkToken, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(checkToken);

router
	.route('/')
	.get(getAllReviews)
	.post(restrictTo('user', 'admin'), setTourUserIds, createReview);

router
	.route('/:id')
	.get(getReview)
	.patch(restrictTo('user', 'admin'), setTourUserIds, updateReview)
	.delete(restrictTo('admin'), setTourUserIds, deleteReview);

module.exports = router;
