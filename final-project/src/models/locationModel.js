const { DataTypes } = require('sequelize');
const { logError, logInfo } = require('../../utils/logger');
const { sequelize } = require('../../config/db');

const Location = sequelize.define('Location', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	type: {
		type: DataTypes.CHAR,
		allowNull: false,
		defaultValue: 'Point',
		validate: {
			isIn: [['Point']],
		},
	},
	coordinates: {
		type: DataTypes.GEOMETRY('POINT'),
		allowNull: false,
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

module.exports = { Location };
