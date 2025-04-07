const mongoose = require('mongoose')


// Define student schema
const adminSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email:String,
    password:String,
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'college'
    },
});

module.exports = mongoose.model('admin', adminSchema);
