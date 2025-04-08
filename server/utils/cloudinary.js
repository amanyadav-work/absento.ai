require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload image to Cloudinary
const uploadImage = async (file) => {
    console.log(file);
    
    try {
        const fileData = await cloudinary.uploader.upload(file.data, {
            resource_type: 'auto',
        });
        return fileData.secure_url;
    } catch (error) {
        console.log("ERROR",error);
        throw new Error("Error uploading the picture.");
    }
};

module.exports = uploadImage