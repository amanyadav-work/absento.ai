const express = require('express')
const router = express.Router()

const { addCourse, markAttendance, getAttendance } = require('../controllers/facultyController')

router.put('/add-course', addCourse)
router.post('/mark-attendance', markAttendance)
router.get('/get-attendance', getAttendance)

module.exports = router