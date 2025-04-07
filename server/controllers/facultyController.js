const facultyModel = require('../model/faculty')
const attendanceModel = require('../model/attendance');
const sendWhatsapp = require('../utils/twilioapi');
const mongoose = require('mongoose')

const addCourse = async (req, res) => {
    const { course } = req.body;

    // Validate that the course is provided
    if (!course) {
        return res.status(400).json({ message: 'Course is required.' });
    }

    try {
        // Find and update the faculty's course
        const faculty = await facultyModel.findOneAndUpdate(
            { email: req.user.email }, // Use email to find the faculty
            { $set: { course: course } }, // Update the course
            { new: true } // Return the updated document
        );

        // If no faculty found, return 404
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found.' });
        }

        // Send back the updated faculty data
        res.status(200).json({
            message: 'Course updated successfully.',
            faculty
        });
    } catch (error) {
        console.error("FACULTY:::", error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const markAttendance = async (req, res) => {
    const { detectedStudents, nonDetectedStudents, absentReasons } = req.body;
    const { collegeId, courseId } = req.query;
    try {
        const nonDetectedStudentIds = new Set(nonDetectedStudents.map(item => item._id));

        // Create a map of absent reasons for faster access by studentId
        const absentReasonMap = absentReasons.reduce((acc, item) => {
            acc[item.studentId] = item.reason;
            return acc;
        }, {});

        const arr = [...detectedStudents, ...nonDetectedStudents];
        const students = arr.map(std => {
            // Determine the student's status
            const status = nonDetectedStudentIds.has(std._id) ? 'absent' : 'present';

            // Create the student object with the basic information
            const studentObj = {
                student: std._id,
                status
            };

            // Add the reason if the student is absent
            if (status === 'absent' && absentReasonMap[std._id]) {
                studentObj.reason = absentReasonMap[std._id];
            }

            return studentObj;
        });


        const presentPercentage = (detectedStudents.length / arr.length) * 100
        const attendance = await attendanceModel.create({
            collegeId, courseId, students, presentPercentage
        })


        // Whatsapp Sending
        const sendMessagesPromises = nonDetectedStudents.map(absentStd => {
            const absentReason = absentReasonMap[absentStd._id];
            const message = absentReason
                ? `Your kid ${absentStd.name} was absent. Reason: ${absentReason}.`
                : `Your kid ${absentStd.name} was absent today. We were not informed about the leave. Please ensure they're attending all classes.`;
            return sendWhatsapp(absentStd.parent.phone, message, absentStd.imageUrl);
        });

        // Wait for all messages to be sent concurrently
        await Promise.all(sendMessagesPromises);
        res.send("Attendance marked successfully!");
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send("An error occurred while marking attendance.");
    }
}

const getAttendance = async (req, res) => {
    const { courseId, collegeId, range, start, end } = req.query;
    const { role } = req.user;

    const startDate = new Date(Number(start)); // Convert to Date
    const endDate = new Date(Number(end)); // Convert to Date

    const match = {
        collegeId,
        createdAt: { $gte: startDate, $lte: endDate }
    }
    if (role !== "Admin") {
        match['courseId'] = courseId
    }

    // Match stage
    const matchStage = {
        $match: match
    };

    let groupStage;

    // Group by weekly
    if (range === 'Weekly') {
        groupStage = {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    week: { $isoWeek: "$createdAt" }
                },
                present: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "present"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                absent: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "absent"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                reason: "$students.reason",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                presentPercentage: { $avg: "$presentPercentage" },
            }
        };
    }
    // Group by monthly
    else if (range === 'Monthly') {
        groupStage = {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                present: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "present"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                absent: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "absent"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                reason: "$students.reason",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                presentPercentage: { $avg: "$presentPercentage" },
            }
        };
    }
    // Default case for daily attendance (if range is not weekly or monthly)
    else {
        groupStage = {
            $group: {
                _id: "$_id", // Group by attendance document's _id
                present: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "present"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                absent: {
                    $push: {
                        $cond: [
                            { $eq: ["$students.status", "absent"] },
                            {
                                _id: "$studentDetails._id",
                                name: "$studentDetails.name",
                                rollNo: "$studentDetails.rollNo",
                                imageUrl: "$studentDetails.imageUrl",
                                age: "$studentDetails.age",
                                reason: "$students.reason",
                                parentPhone: "$parentDetails.phone"
                            },
                            null
                        ]
                    }
                },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                presentPercentage: { $first: "$presentPercentage" }
            }
        };
    }

    let attendance = await attendanceModel.aggregate([
        matchStage,
        { $unwind: "$students" },
        { $lookup: { from: "students", localField: "students.student", foreignField: "_id", as: "studentDetails" } },
        { $unwind: "$studentDetails" },
        { $lookup: { from: "parents", localField: "studentDetails.parent", foreignField: "_id", as: "parentDetails" } },
        { $unwind: "$parentDetails" },
        groupStage,
        {
            $project: {
                present: { $filter: { input: "$present", as: "item", cond: { $ne: ["$$item", null] } } },
                absent: { $filter: { input: "$absent", as: "item", cond: { $ne: ["$$item", null] } } },
                createdAt: 1,
                updatedAt: 1,
                presentPercentage: 1
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    // If the role is Admin, combine attendance for the same day
    if (role === 'Admin' && range === 'Daily') {
        const combinedAttendance = attendance.reduce((acc, record) => {
            const date = new Date(record.createdAt).toISOString().split('T')[0]; // Get only the date part

            // If the date already exists, merge the present and absent lists
            if (!acc[date]) {
                acc[date] = {
                    date: date,
                    present: [],
                    absent: [],
                    presentPercentage: 0,
                    createdAt: record.createdAt,  // First createdAt
                    updatedAt: record.updatedAt,  // Most recent updatedAt
                    count: 0
                };
            }

            // Combine present and absent students
            acc[date].present = acc[date].present.concat(record.present);
            acc[date].absent = acc[date].absent.concat(record.absent);

            // Calculate average presentPercentage
            acc[date].presentPercentage = ((acc[date].presentPercentage * acc[date].count) + record.presentPercentage) / (acc[date].count + 1);
            acc[date].count += 1;

            // Keep the first createdAt and most recent updatedAt
            acc[date].createdAt = acc[date].createdAt; // First record's createdAt (already set initially)
            acc[date].updatedAt = record.updatedAt; // Most recent updatedAt (set to the latest record)

            return acc;
        }, {});

        // Convert the accumulator object back to an array
        attendance = Object.values(combinedAttendance);
    }
    

    res.status(201).json(attendance);
};







module.exports = { addCourse, markAttendance, getAttendance }