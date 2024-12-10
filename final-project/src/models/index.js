const { sequelize } = require('../../config/db');

// MODELS
const { Tour } = require('./tourModel');
const { Location } = require('./locationModel');
const { Image } = require('./imageModel');
const { User } = require('./userModel');
const { Review } = require('./reviewModel');

// Users_Tours
Tour.belongsToMany(User, {
	through: 'Users_To_Tours',
	as: 'users',
	foreignKey: 'tourId',
	timestamps: false,
});

User.belongsToMany(Tour, {
	through: 'Users_To_Tours',
	as: 'tours',
	foreignKey: 'userId',
	timestamps: false,
});

// Tours_Locations
Tour.belongsToMany(Location, {
	through: 'Tours_To_Locations',
	as: 'locations',
	foreignKey: 'tourId',
	timestamps: false,
});

Location.belongsToMany(Tour, {
	through: 'Tours_To_Locations',
	as: 'tours',
	foreignKey: 'locationId',
	timestamps: false,
});

// Tours_Images
Tour.belongsToMany(Image, {
	through: 'Tours_To_Images',
	as: 'images',
	foreignKey: 'tourId',
	timestamps: false,
});

Image.belongsToMany(Tour, {
	through: 'Tours_To_Images',
	as: 'tours',
	foreignKey: 'imageId',
	timestamps: false,
});


// Users_Reviews
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Tours_Reviews
Tour.hasMany(Review, { foreignKey: 'tourId', as: 'reviews' });
Review.belongsTo(Tour, {
	foreignKey: 'tourId',
	as: 'tour',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = {
	sequelize,
	Tour,
	Image,
	Location,
	User,
	Review,
};
