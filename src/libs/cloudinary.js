const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloudName,
  cloudinaryAPIKey,
  cloudinaryAPISecret
} = require("../config");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryAPIKey,
  api_secret: cloudinaryAPISecret
});

module.exports = cloudinary;