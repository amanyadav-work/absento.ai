const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    name: String,
    description: String,
})

module.exports = mongoose.model('course', courseSchema);