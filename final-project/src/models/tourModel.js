const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

const { Location } = require('./locationModel');
const { Image } = require('./imageModel');
const sequelize = getSequelizeInstance();

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
				notNull: { msg: 'A tour must have a name' },
				notEmpty: { msg: 'A tour must have a name' },
				len: {
					args: [5, 40],
					msg: 'A tour name must be between 5 and 40 characters',
				},
				isAlphaSpace(value) {
					if (!/^[a-zA-Z\s]+$/.test(value)) {
						throw new Error('Tour name must only contain characters');
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
				notNull: { msg: 'A tour must have a duration' },
				isInt: { msg: 'Duration must be a number' },
			},
		},
		maxGroupSize: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour must have a Group Size' },
				isInt: { msg: 'Group size must be a number' },
			},
		},
		difficulty: {
			type: DataTypes.ENUM('easy', 'medium', 'difficult'),
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour must have a difficulty' },
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
				min: { args: 1, msg: 'Rating must be above 1.0' },
				max: { args: 5, msg: 'Rating must be below 5.0' },
			},
			set(value) {
				this.setDataValue('ratingsAverage', Math.round(value * 10) / 10);
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
				notNull: { msg: 'A tour must have a price' },
				isFloat: { msg: 'Price must be a number' },
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
				notNull: { msg: 'A tour must have a summary' },
				notEmpty: { msg: 'Summary cannot be empty' },
			},
		},
		description: {
			type: DataTypes.STRING,
		},
		imageCover: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'A tour must have a Cover image' },
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
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		// indexes: [
		// 	{ fields: ['price', 'ratingsAverage'] },
		// 	{ fields: ['slug'] },
		// ],
	},
	{
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

// Tours_Locations
Tour.belongsToMany(Location, {
	through: 'Tours_Locations',
	as: 'locations',
	foreignKey: 'tourId',
	timestamps: false,
});

Location.belongsToMany(Tour, {
	through: 'Tours_Locations',
	as: 'tours',
	foreignKey: 'locationId',
	timestamps: false,
});

// Tours_Images
Tour.belongsToMany(Image, {
	through: 'Tours_Images',
	as: 'images',
	foreignKey: 'tourId',
	timestamps: false,
});

Image.belongsToMany(Tour, {
	through: 'Tours_Images',
	as: 'tours',
	foreignKey: 'imageId',
	timestamps: false,
});

sequelize
	.sync()
	.then(() => {
		logInfo(
			`Tables ${JSON.stringify(
				Object.keys(sequelize.models).join(', '),
			)} created or reset`,
		);
	})
	.catch((error) => logError('Error creating tables:', error));

module.exports = { Tour };
