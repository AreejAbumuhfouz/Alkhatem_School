// const User = require('./User');
// const Resource = require('./resources');
// const UserResource = require('./teacherResource');

// // Define associations
// User.belongsToMany(Resource, { through: UserResource, foreignKey: 'userId' });
// Resource.belongsToMany(User, { through: UserResource, foreignKey: 'resourceId' });



const User = require('./User');
const Resource = require('./resources');
const UserResource = require('./teacherResource');

// Associations
User.belongsToMany(Resource, {
  through: UserResource,
  foreignKey: 'userId',
  otherKey: 'resourceId',
});
Resource.belongsToMany(User, {
  through: UserResource,
  foreignKey: 'resourceId',
  otherKey: 'userId',
});

// Optional: to access more easily
User.hasMany(UserResource, { foreignKey: 'userId' });
Resource.hasMany(UserResource, { foreignKey: 'resourceId' });
UserResource.belongsTo(User, { foreignKey: 'userId' });
UserResource.belongsTo(Resource, { foreignKey: 'resourceId' });

module.exports = { User, Resource, UserResource };