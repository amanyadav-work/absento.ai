require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result); // Resolve with the upload result if successful
          }
        }
      ).end(file.data); // Upload the file buffer
    });

    return result.secure_url;
  } catch (error) {
    // Log the error to the console if something goes wrong
    console.error('Error uploading file to Cloudinary:', error);
    throw error; // Re-throw the error to propagate it if needed
  }
};

module.exports = uploadImage