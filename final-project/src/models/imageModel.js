const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const Tour = require('./tourModel');
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

// Image.sync({ force: true })
// 	.then(() => {
// 		console.log('Image created or reset');
// 	})
// 	.catch((error) => console.log('Error creating tables:', error));

module.exports = Image;
