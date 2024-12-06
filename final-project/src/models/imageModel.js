const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');
const { logError, logInfo } = require('../../utils/logger');

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

module.exports = { Image };
