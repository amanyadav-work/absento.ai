require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const adminModel = require('../model/admin');
const facultyModel = require('../model/faculty');
const parentModel = require('../model/parent');
const bcrypt = require('bcrypt');



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const login = async (req, res) => {
    const { email, password, role } = req.body;
    let user;
    try {
        if (role === "Admin") {
            user = await adminModel.findOne({ email })
        } else if (role === "Faculty") {
            user = await facultyModel.findOne({ email })

        } else if (role === "Parent") {
            user = await parentModel.findOne({ email })
        }

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) { return res.status(500).send({ message: 'Incorrect Password' }) }
            // Generate JWT token
            const token = jwt.sign({ email, role }, process.env.JWT_SECRET);

            // Set token in cookie and respond with success
            res.cookie('jwttoken', token, {
                httpOnly: true,  // Prevent JavaScript access to the cookie
                secure: true,
                sameSite: 'None', // Allow cross-origin requests (important for CORS)
            });
            res.status(201).send({ message: "Operation Successful" });
        });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send({ message: "Server Error: " + error.message });
        }
    }
};

// Helper function to handle password hashing
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Helper function to upload image to Cloudinary
const uploadImage = async (file) => {
    try {
        const fileData = await cloudinary.uploader.upload(file.tempFilePath);
        return fileData.secure_url;
    } catch (error) {
        throw new Error("Error uploading the picture.");
    }
};

// Register function with improvements
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // Validate role
        const validRoles = ['Admin', 'Faculty', 'Parent'];
        if (!validRoles.includes(role)) {
            return res.status(400).send({ message: "Invalid role." });
        }

        // Check if a picture was uploaded for non-Admin roles
        if (role !== "Admin" && (!req.files || !req.files.picture)) {
            return res.status(400).send({ message: "No picture uploaded." });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        let imageUrl = null;
        if (role !== "Admin") {
            // Upload image to Cloudinary if it's not Admin
            imageUrl = await uploadImage(req.files.picture);
        }


        // Create the user based on the role
        let user;
        if (role === "Admin") {
            const existingUser = await adminModel.findOne({ email })
            if (existingUser) return res.status(409).send({ message: "User Already Exists." })
            user = await adminModel.create({ name, email, phone, password: hashedPassword });
        } else if (role === "Faculty") {
            const existingUser = await facultyModel.findOne({ email })
            if (existingUser) return res.status(409).send({ message: "User Already Exists." })
            user = await facultyModel.create({ name, email, phone, password: hashedPassword, imageUrl, collegeId: req.body.collegeId });
        } else if (role === "Parent") {
            const existingUser = await parentModel.findOne({ email })
            if (existingUser) return res.status(409).send({ message: "User Already Exists." })
            user = await parentModel.create({ name, email, phone, password: hashedPassword, imageUrl });
        }

        // Generate JWT token
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET);

        // Set token in cookie and respond with success
        res.cookie('jwttoken', token, {
            httpOnly: true,  // Prevent JavaScript access to the cookie
            secure: true,
            sameSite: 'None', // Allow cross-origin requests (important for CORS)
        });
        res.status(201).send({ message: "Operation Successful" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server Error: " + error.message });
    }
};

module.exports = { login, register };
