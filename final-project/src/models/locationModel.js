const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const sequelize = getSequelizeInstance();

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

module.exports = Location;
