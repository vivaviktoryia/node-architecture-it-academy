const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

const Tour = sequelize.define(
	'Tour',
	{
		id: {
			type: DataTypes.SMALLINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notNull: { msg: 'A tour should have a name' },
				notEmpty: { msg: 'A tour should have a name' },
				len: {
					args: [2, 50],
					msg: 'A tour name should be between 2 and 50 characters',
				},
				isAlphaSpace(value) {
					if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(value)) {
						throw new Error('Tour name should only contain letters and spaces');
					}
				},
			},
		},
		slug: {
			type: DataTypes.STRING,
		},
		duration: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a duration' },
				isInt: { msg: 'Duration should be a number' },
			},
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		maxGroupSize: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a Group Size' },
				isInt: { msg: 'Group size should be a number' },
			},
		},
		difficulty: {
			type: DataTypes.ENUM('easy', 'medium', 'difficult'),
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a difficulty' },
				isIn: {
					args: [['easy', 'medium', 'difficult']],
					msg: 'Difficulty is either: easy, medium, difficult',
				},
			},
		},
		ratingsAverage: {
			type: DataTypes.FLOAT,
			defaultValue: 4.5,
			validate: {
				min: { args: 1, msg: 'Rating should be above 1.0' },
				max: { args: 5, msg: 'Rating should be below 5.0' },
			},
		},
		ratingsQuantity: {
			type: DataTypes.SMALLINT,
			defaultValue: 0,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a price' },
				isFloat: { msg: 'Price should be a number' },
			},
		},
		priceDiscount: {
			type: DataTypes.FLOAT,
			validate: {
				isBelowPrice(value) {
					if (value >= this.price) {
						throw new Error('Discount price should be below regular price');
					}
				},
			},
		},
		summary: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a summary' },
				notEmpty: { msg: 'Summary cannot be empty' },
			},
		},
		description: {
			type: DataTypes.STRING(700),
			allowNull: false,
			validate: {
				len: {
					args: [2, 700],
					msg: 'A tour description should be between 2 and 700 characters',
				},
			},
		},
		imageCover: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour should have a Cover Image' },
			},
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
		indexes: [{ fields: ['slug'] }],
		hooks: {
			beforeCreate: (tour) => {
				tour.slug = tour.name.toLowerCase().replace(/ /g, '-');
			},
		},
		getterMethods: {
			durationWeeks() {
				return this.duration / 7;
			},
		},
	},
);

module.exports = { Tour };
