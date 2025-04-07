const express = require('express');
const router = express.Router();

const { getdata, getCourses, getStudents, getAttendanceForStudent, getGroqChat, saveAttendancePredictions, getAttendancePredictions } = require('../controllers/userController');
router.get('/getdata', getdata)
router.get('/getcourses', getCourses)
router.get('/get-students', getStudents)
router.get('/get-student-attendance', getAttendanceForStudent)
router.post('/groq-chat', getGroqChat)
router.post('/save-prediction', saveAttendancePredictions)
router.get('/get-prediction', getAttendancePredictions)

module.exports = router;