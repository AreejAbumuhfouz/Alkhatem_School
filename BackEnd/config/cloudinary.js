require('dotenv').config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Cloud_Key,
  api_secret: process.env.Cloud_Secret,
});

module.exports = cloudinary;