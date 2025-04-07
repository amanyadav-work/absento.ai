const mongoose = require('mongoose')


// Define student schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  rollNo: String,
  imageUrl: String,
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'college'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parent'
  },
  faceDescriptor: Array,
});

module.exports = mongoose.model('student', studentSchema);
