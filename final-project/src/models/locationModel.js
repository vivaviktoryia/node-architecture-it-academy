const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

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

sequelize
	.sync()
	.then(() => {
		logInfo(
			`Tables ${JSON.stringify(
				Object.keys(sequelize.models).join(', '),
			)} created or reset`,
		);
	})
	.catch((error) => logError('Error creating tables:', error));

module.exports = {Location};
