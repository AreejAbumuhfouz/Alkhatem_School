const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserResource = sequelize.define('UserResource', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  resourceId: { type: DataTypes.INTEGER, allowNull: false },
  quantityTaken: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  tableName: 'user_resources',
  timestamps: true,
});

module.exports = UserResource;
