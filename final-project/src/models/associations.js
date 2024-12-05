module.exports = (models) => {
	models.User.belongsToMany(models.Tour, { through: 'UserTour' });
	models.User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });

	models.Tour.belongsToMany(models.User, { through: 'UserTour' });
	models.Tour.hasMany(models.Review, { foreignKey: 'tourId', as: 'reviews' });
	models.Tour.belongsToMany(models.Location, { through: 'TourLocation' });
	models.Tour.belongsToMany(models.Image, { through: 'TourImage' });

	models.Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
	models.Review.belongsTo(models.Tour, { foreignKey: 'tourId', as: 'tour' });

	models.Location.belongsToMany(models.Tour, { through: 'TourLocation' });

	models.Image.belongsToMany(models.Tour, { through: 'TourImage' });
};
