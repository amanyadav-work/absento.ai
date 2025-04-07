const cookieParser = require('cookie-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express')
const app = express()
const port = process.env.PORT;
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parentRoutes = require('./routes/parentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const fileupload = require('express-fileupload')

const mongoose = require('mongoose');
const authenticateToken = require('./utils/authverify');
mongoose.connect(process.env.MONGODB_ATLAS_URI);

// mongoose.connect('mongodb://127.0.0.1:27017/ai-attendance');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload({
    useTempFiles: true
}));

app.use('/auth', authRoutes);
app.use('/user',authenticateToken, userRoutes);
app.use('/admin',authenticateToken, adminRoutes);
app.use('/parent',authenticateToken, parentRoutes);
app.use('/faculty',authenticateToken, facultyRoutes);

app.listen(port, () => {
    console.log(`Working on port ${port}`);
})