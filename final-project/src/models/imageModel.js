const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

const Image = sequelize.define('Image', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	fileName: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
});

module.exports = { Image };
