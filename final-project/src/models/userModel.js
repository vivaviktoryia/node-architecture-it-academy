const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sequelize = getSequelizeInstance();

const User = sequelize.define(
	'User',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			// validate: {
			// 	len: [3, 40],
			// 	is: /^[a-zA-Z\s]+$/i,
			// },
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			lowercase: true,
			validate: {
				isEmail: true,
				len: [5, 50],
			},
		},
		photo: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.ENUM('user', 'guide', 'lead-guide', 'admin'),
			defaultValue: 'user',
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [5, 255],
			},
			select: false,
		},
		passwordChangedAt: {
			type: DataTypes.DATE,
		},
		passwordResetToken: {
			type: DataTypes.STRING,
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			select: false, // Not selecting this field by default
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
	},
	{
		hooks: {
			// Hook to hash password before saving it
			beforeSave: async (user, options) => {
				// Check if password is modified
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 12);
					user.passwordChangedAt = new Date(Date.now() - 1000);
				}
			},

			// Custom finder for excluding inactive users
			beforeFind: (options) => {
				options.where = { ...options.where, active: true }; // Only fetch active users
			},
		},
	},
);

User.prototype.correctPassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = Math.floor(
			this.passwordChangedAt.getTime() / 1000,
		);
		return changedTimeStamp > JWTTimestamp;
	}
	return false; // False means password wasn't changed
};

User.prototype.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
	return resetToken;
};

// User.sync({ force: true }) // Это удалит таблицу, если она уже существует, и создаст новую
// 	.then(() => console.log('User table created or reset'))
// 	.catch((error) => console.log('Error creating table:', error));

module.exports = User;