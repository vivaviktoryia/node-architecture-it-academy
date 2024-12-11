const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');
const { Tour } = require('./tourModel');

const Review = sequelize.define(
	'Review',
	{
		id: {
			type: DataTypes.SMALLINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		review: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Review cannot be empty!',
				},
			},
		},

		rating: {
			type: DataTypes.TINYINT,
			allowNull: false,
			validate: {
				min: 1,
				max: 5,
			},
		},
		tourId: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			// references: {
			// 	model: 'Tours',
			// 	key: 'id',
			// },
		},
		userId: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			// references: {
			// 	model: 'Users',
			// 	key: 'id',
			// },
		},

		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
			onUpdate: DataTypes.NOW,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['tourId', 'userId'],
			},
		],

		hooks: {
			afterCreate: async (review, options) => {
				if (review.tourId) {
					await Review.calcAverageRatings(review.tourId, options.transaction);
				} else {
					logError('tourId is undefined in afterCreate');
				}
			},
			afterDestroy: async (review, options) => {
				if (review.tourId) {
					await Review.calcAverageRatings(review.tourId, options.transaction);
				} else {
					logError('tourId is undefined in afterDestroy');
				}
			},
			afterUpdate: async (review, options) => {
				console.log(
					'💥💥💥💥💥After update hook triggered for review:',
					review,
				);
				if (review.tourId) {
					await Review.calcAverageRatings(review.tourId, options.transaction);
				} else {
					logError('tourId is undefined in afterUpdate');
				}
			},
		},
	},
);

Review.calcAverageRatings = async function (tourId, transaction) {
	try {
		const stats = await Review.findAll({
			where: { tourId },
			attributes: [
				[Sequelize.fn('COUNT', sequelize.col('rating')), 'nRating'],
				[Sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
			],
			group: ['tourId'],
			transaction,
		});
		if (stats.length > 0) {
			const avgRating = stats[0].get('avgRating');
			const nRating = stats[0].get('nRating');

			// Update the tour's ratings
			await Tour.update(
				{ ratingsQuantity: nRating, ratingsAverage: avgRating },
				{ where: { id: tourId }, transaction },
			);
			logInfo(
				`Update the tour's ratings: avgRating - ${avgRating}, nRating - ${nRating}`,
			);
		} else {
			// If no ratings, set default values
			await Tour.update(
				{ ratingsQuantity: 0, ratingsAverage: 4.5 },
				{ where: { id: tourId } },
			);
			logInfo(
				`No ratings, set default values: avgRating - ${avgRating}, nRating - ${nRating}`,
			);
		}
	} catch (error) {
		logError(
			`Failed to update ratings for Tour ID: ${tourId}. Error: ${error.message}`,
		);
	}
};

module.exports = { Review };
