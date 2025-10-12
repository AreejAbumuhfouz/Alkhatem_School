const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update with your actual database configuration file path
const Resource = require('./resources'); 
const UserResource = require('./teacherResource');

// Define the Users model
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
        // ✅ Use CITEXT to make email case-insensitive (requires PostgreSQL)
        type: DataTypes.CITEXT, 
        allowNull: false,
        unique: true, // Prevents duplicates like Tala@gmail.com / tala@gmail.com
        validate: {
            isEmail: true,
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
            type: DataTypes.BOOLEAN, // Correct type
            defaultValue: false,
        },
}, {
    tableName: 'users',
    timestamps: true, // Enables createdAt and updatedAt
});



module.exports = User;
