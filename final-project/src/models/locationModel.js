const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const Tour = require('./tourModel');
const sequelize = getSequelizeInstance();
sequelize.sync({ force: true });

const Location = sequelize.define('Location', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	coordinates: {
		type: DataTypes.GEOMETRY('POINT'),
		allowNull: false,
	},
});

// Tour.belongsToMany(Location, { through: 'Tours-Locations' });

// sequelize
// 	.sync({ force: true })
// 	.then(() => {
// 		console.log('Tour created or reset');
// 	})
// 	.catch((error) => console.log('Error creating tables:', error));

module.exports = Location;
