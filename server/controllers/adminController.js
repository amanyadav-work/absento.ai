require('dotenv').config();
const collegeModel = require('../model/college')
const adminModel = require('../model/admin');
const uploadImage = require('../utils/cloudinary');



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