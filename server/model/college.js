const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: String,
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'  
        }
    ],
    admin:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'admin'
        },
    logoUrl: String,
});

module.exports = mongoose.model('college', collegeSchema);
