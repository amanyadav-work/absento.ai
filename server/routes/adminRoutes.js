const express = require('express');
const router = express.Router();

const { addCollege } = require('../controllers/adminController');

router.post('/add-college', addCollege)

module.exports = router;