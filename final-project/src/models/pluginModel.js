const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

const Plugin = sequelize.define('Plugin', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	type: {
		type: DataTypes.ENUM('tour', 'greeting', 'advertisement'),
		allowNull: false,
		unique: true,
		validate: {
			notNull: { msg: 'A Plugin should have a type' },
			isIn: {
				args: [['tour', 'greeting', 'advertisement']],
				msg: 'Type is either: tour, greeting, advertisement',
			},
		},
	},
	content: {
		type: DataTypes.JSON,
		allowNull: false,
	},
	order: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		validate: {
			notNull: { msg: 'A Plugin should have an order' },
			min: { args: 1, msg: 'Order should be above 1' },
			isInt: { msg: 'Order should be a number' },
		},
	},
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
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

module.exports = { Plugin };
