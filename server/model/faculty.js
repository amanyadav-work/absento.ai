const mongoose = require('mongoose')


// Define student schema
const facultySchema = new mongoose.Schema({
    name: String,
    phone: Number,
    imageUrl: String,
    email:String,
    password:String,
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'college'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course'
    }
});

module.exports = mongoose.model('faculty', facultySchema);
