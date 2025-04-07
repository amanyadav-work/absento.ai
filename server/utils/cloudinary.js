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
        const fileData = await cloudinary.uploader.upload(file.tempFilePath);
        return fileData.secure_url;
    } catch (error) {
        throw new Error("Error uploading the picture.");
    }
};

module.exports = uploadImage