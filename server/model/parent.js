const mongoose = require('mongoose')

// Define student schema
const parentSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  imageUrl: String,
  email: String,
  password: String,
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
  }]
});

module.exports = mongoose.model('parent', parentSchema);
