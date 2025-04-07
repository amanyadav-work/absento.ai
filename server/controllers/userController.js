const adminModel = require('../model/admin');
const facultyModel = require('../model/faculty');
const parentModel = require('../model/parent');
const attendanceModel = require('../model/attendance');
const courseModel = require('../model/course');
const collegeModel = require('../model/college');
const studentModel = require('../model/student');
const predictionModel = require('../model/prediction');
const mongoose = require('mongoose');
const { GenerateAiData } = require('../utils/groqai')
// Helper function to handle common logic for finding user by email and role
const findUserByRole = async (role, email) => {
    switch (role) {
        case "Admin":
            return await adminModel.findOne({ email });
        case "Faculty":
            return await facultyModel.findOne({ email });
        case "Parent":
            return await parentModel.findOne({ email });
        default:
            return null;
    }
};

// Get user data based on role and email
const getdata = async (req, res) => {
    try {
        const { role, email } = req.user;
        const user = await findUserByRole(role, email);

        if (!user) {
            return res.status(404).json({ message: `No user found with role: ${role}` });
        }

        res.json(user);
    } catch (error) {
        console.error("Error in getdata:", error);
        res.status(500).json({ message: "Server error occurred while fetching user data." });
    }
};

const getCourses = async (req, res) => {
    try {
        const { collegeId } = req.query;

        let courses;
        if (collegeId && collegeId !== undefined && collegeId !== 'undefined') {
            // Correct way to instantiate ObjectId
            const objectId = new mongoose.Types.ObjectId(collegeId);
            const data = await collegeModel.findOne({ _id: objectId }).populate("courses");
            courses = data;

        } else {
            // Fetch all courses
            courses = await courseModel.find().select('_id name');
        }

        if (courses?.length === 0) {
            return res.status(404).json({ message: "No courses found." });
        }

        res.json(courses);
    } catch (error) {
        console.error("Error in getCourses:", error);
        res.status(500).json({ message: "Server error occurred while fetching courses." });
    }
};

const getStudents = async (req, res) => {


    try {
        const { collegeId, courseId } = req.query;
        if (!collegeId) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        let students;
        if (req.user.role === "Admin") {
            students = await studentModel.find({ college: collegeId }).populate('parent');
        } else if (req.user.role === "Faculty") {
            students = await studentModel.find({ course: courseId, college: collegeId }).populate('parent');
        } else {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        // If no students found, return an appropriate message
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        // Return the list of students
        return res.status(200).json({ message: 'Success', students });
    } catch (error) {
        // Catch and handle any unexpected errors
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Function to get attendance for a student for a specific month (e.g., May, June)
const getAttendanceForStudent = async (req, res) => {
    const { start, end, stdId } = req.query;


    try {
        const startDate = new Date(Number(start)); // Convert to Date
        const endDate = new Date(Number(end)); // Convert to Date

        // Correct usage of ObjectId
        const studentObjectId = new mongoose.Types.ObjectId(stdId);

        // Query to find attendance for the student within the specific month
        const attendance = await attendanceModel.aggregate([
            {
                $unwind: '$students'
            },
            {
                $match: {
                    'students.student': studentObjectId,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    status: '$students.status',
                    reason: '$students.reason',
                    date: '$createdAt'
                }
            }
        ]);

        // Log the result for debugging purposes
        res.status(201).json(attendance)
    } catch (error) {
        console.error('Error fetching attendance for student:', error);
        res.status(500).send("An error occurred fetching attendance for student.");
        throw error;
    }
};

const getGroqChat = async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await GenerateAiData(prompt);
        res.status(201).json(response);
    } catch (error) {
        console.error("Error generating AI data:", error);
        res.status(500).json({ error: "An error occurred while generating the AI data." });
    }

};

const saveAttendancePredictions = async (req, res) => {
    const { stdId } = req.query;
    const { prediction } = req.body;
    try {
        await predictionModel.create({
            stdId,
            prediction
        })
        res.status(201).send('Successfully Saved Prediction')
    } catch (error) {
        console.error(error);
        res.status(500).send('Somthing Went Wrong')
    }
}

const getAttendancePredictions = async (req, res) => {
    const { stdId } = req.query;
    try {
        const prediction = await predictionModel.findOne({ stdId })
        res.status(201).json(prediction)
    } catch (error) {
        console.error(error);
        res.status(500).send('Somthing Went Wrong')
    }
}

module.exports = { getdata, getCourses, getStudents, getAttendanceForStudent, getGroqChat, saveAttendancePredictions, getAttendancePredictions };
