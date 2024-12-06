const { getSequelizeInstance } = require('../../config/db');
const User = require('./userModel');
const Location = require('./locationModel');
const Image = require('./imageModel');
const Tour = require('./tourModel');

const sequelize = getSequelizeInstance();

sequelize.models.User = User;
sequelize.models.Location = Location;
sequelize.models.Image = Image;
sequelize.models.Tour = Tour;

// sequelize
// 	.sync({ force: true })
// 	.then(() => {
// 		console.log('All tables created or reset');
// 		console.log(sequelize.models);
// 	})
// 	.catch((error) => console.log('Error creating tables:', error));

User.belongsToMany(Tour, { through: 'UserTours' });

Tour.belongsToMany(Location, { through: 'TourLocations' });
Tour.belongsToMany(Image, { through: 'TourImages' });
Tour.belongsToMany(User, { through: 'UserTours' });

Location.belongsToMany(Tour, { through: 'TourLocations' });

Image.belongsToMany(Tour, { through: 'TourImages' });
// sequelize;

module.exports = sequelize ;
// console.log(sequelize.models);
// module.exports = (models) => {
// 	models.User.belongsToMany(models.Tour, { through: 'UserTour' });
// 	models.User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });

// 	models.Tour.belongsToMany(models.User, { through: 'UserTour' });
// 	models.Tour.hasMany(models.Review, { foreignKey: 'tourId', as: 'reviews' });
// 	models.Tour.belongsToMany(models.Location, { through: 'TourLocation' });
// 	models.Tour.belongsToMany(models.Image, { through: 'TourImage' });

// 	models.Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
// 	models.Review.belongsTo(models.Tour, { foreignKey: 'tourId', as: 'tour' });

// 	models.Location.belongsToMany(models.Tour, { through: 'TourLocation' });

// 	models.Image.belongsToMany(models.Tour, { through: 'TourImage' });
// };
