const mongoose = require('mongoose')


// Define student schema
const attendanceSchema = new mongoose.Schema({
    collegeId: String,
    courseId: String,
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            default: 'absent'
        },
        reason: String 
    }],
    presentPercentage:Number,
}, { timestamps: true });

module.exports = mongoose.model('attendance', attendanceSchema);
