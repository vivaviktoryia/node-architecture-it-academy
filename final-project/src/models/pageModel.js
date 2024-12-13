const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

const Page = sequelize.define('Page', {
	id: {
		type: DataTypes.SMALLINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notNull: { msg: 'A page should have a name' },
			notEmpty: { msg: 'A page should have a name' },
			len: {
				args: [2, 50],
				msg: 'A page name should be between 2 and 50 characters',
			},
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

module.exports = { Page };
