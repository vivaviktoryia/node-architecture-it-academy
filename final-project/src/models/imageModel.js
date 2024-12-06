const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const sequelize = getSequelizeInstance();

const Image = sequelize.define('Image', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isUrl: { msg: 'Image URL must be valid' },
		},
	},
});

module.exports = Image;
