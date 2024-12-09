const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

// const { User } = require('./userModel');
// const { Tour } = require('./tourModel');
// const sequelize = getSequelizeInstance();

const Review = sequelize.define('Review', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	review: {
		type: DataTypes.TEXT,
		allowNull: false,
	},

	rating: {
		type: DataTypes.TINYINT,
		allowNull: false,
		validate: {
			min: 1,
			max: 5,
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
});

// // Users_Reviews
// User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
// Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// // Tours_Reviews
// Tour.hasMany(Review, { foreignKey: 'tourId', as: 'reviews' });
// Review.belongsTo(Tour, { foreignKey: 'tourId' });

// sequelize
// 	.sync()
// 	.then(() => {
// 		logInfo(
// 			`Tables ${JSON.stringify(
// 				Object.keys(sequelize.models).join(', '),
// 			)} created or reset`,
// 		);
// 	})
// 	.catch((error) => logError('Error creating tables:', error));

module.exports = { Review };
