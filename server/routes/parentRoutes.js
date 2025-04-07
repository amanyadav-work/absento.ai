const express = require('express');
const router = express.Router()

const { addStudent, getStudents } = require('../controllers/parentController');

router.post('/add-student', addStudent)
router.get('/get-students', getStudents)
module.exports = router;