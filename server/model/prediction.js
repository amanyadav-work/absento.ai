const mongoose = require('mongoose')

const predictionSchema = new mongoose.Schema({
    stdId: {
        type: String,
        required: true
    },
    prediction: {
        type: mongoose.Schema.Types.Mixed, // This allows you to store any type of data (including objects)
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('prediction', predictionSchema)