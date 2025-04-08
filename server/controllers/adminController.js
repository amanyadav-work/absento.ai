require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const collegeModel = require('../model/college')
const adminModel = require('../model/admin');
const uploadImage = require('../utils/cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const addCollege = async (req, res) => {
    const { name, courses } = req.body;
    console.log(name, courses,req);
    const logoUrl = await uploadImage(req.files.logo)
    const college = await collegeModel.create({
        name, courses, logoUrl
    })
    const admin = await adminModel.findOneAndUpdate({email:req.user.email},{collegeId:college._id})
    res.send({college_id:college._id})
}


module.exports = { addCollege };