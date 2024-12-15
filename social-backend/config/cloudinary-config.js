const cloudinary = require('cloudinary').v2;

// Set Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Your Cloudinary Cloud Name
  api_key: process.env.API_KEY,        // Your Cloudinary API Key
  api_secret: process.env.API_SECRET,  // Your Cloudinary API Secret
});

module.exports = cloudinary;
