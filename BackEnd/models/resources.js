// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); // Update with your actual database configuration file path
// const User =require('./User');
// const UserResource = require('./teacherResource');
// // Define the Resources model
// const Resource = sequelize.define('Resource', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     imageUrl: {  
//         type: DataTypes.STRING,
//         allowNull: true, 
//     },
//     name: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     location: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//     },
//     school_level: {
//         type: DataTypes.ENUM('C1', 'C2', 'C3','KG','ALL'),
//         allowNull: false,
//     },
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0,
//     },
//     subject: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//     },
//     isDeleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
// }, {
//     tableName: 'resources',
//     timestamps: true,
// });

// module.exports = Resource;


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update with your actual database configuration file path
const User = require('./User');
const UserResource = require('./teacherResource');

// Define the Resources model
const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    // Multiple image URLs (use ARRAY for Postgres, JSON for flexibility)
    imageUrls: {
        type: DataTypes.ARRAY(DataTypes.STRING), // ✅ works with PostgreSQL
        // type: DataTypes.JSON, // alternative if not using Postgres
        allowNull: true,
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    school_level: {
        type: DataTypes.ENUM('C1', 'C2', 'C3', 'KG', 'ALL'),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    // ✅ Add condition for resource state
    condition: {
        type: DataTypes.ENUM('good-new', 'good-used', 'damaged', 'over-used'),
        allowNull: false,
        defaultValue: 'good-new',
    },

    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'resources',
    timestamps: true,
});

module.exports = Resource;
