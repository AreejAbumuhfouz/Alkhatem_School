// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); // Update with your actual database configuration file path
// const Resource = require('./resources'); 
// const UserResource = require('./teacherResource');

// // Define the Users model
// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING(150),
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//     },
//     role: {
//         type: DataTypes.ENUM('teacher', 'admin'),
//         allowNull: false,
//     },
//     subject_taught: {
//         type: DataTypes.STRING(100),
//         allowNull: true,
//     },
//     isDeleted: {
//             type: DataTypes.BOOLEAN, // Correct type
//             defaultValue: false,
//         },
// }, {
//     tableName: 'users',
//     timestamps: true, // Enables createdAt and updatedAt
// });



// module.exports = User;


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Resource = require('./resources');
const UserResource = require('./teacherResource');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        set(value) {
            // Always save email in lowercase
            this.setDataValue('email', value.toLowerCase());
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('teacher', 'admin'),
        allowNull: false,
    },
    subject_taught: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;
