// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const User = require('./User');

// const Notification = sequelize.define('Notification', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   recipient_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: { model: User, key: 'id' },
//     onDelete: 'CASCADE',
//   },
//   quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
//   is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
//   created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
// }, {
//   tableName: 'notifications',
//   timestamps: false,
// });

// module.exports = Notification;



const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Resource = require('./resources'); // assuming you have a Resource model

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recipient_id: { // user who receives the notification
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  actor_id: { // user who took the resource
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Resource, key: 'id' },
    onDelete: 'CASCADE',
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: 'notifications',
  timestamps: false,
});

// Associations (optional, but useful for fetching names)
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipient_id' });
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actor_id' });
Notification.belongsTo(Resource, { as: 'resource', foreignKey: 'resource_id' });

module.exports = Notification;
