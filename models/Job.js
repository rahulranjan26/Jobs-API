const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Company name is required"],
        maxLength: 50,
    },
    position: {
        type: String,
        required: [true, "Position  is required"],
        maxLength: 100,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'interview', 'declined']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user"]

    },
}, {timestamps: true})

module.exports = mongoose.model("Job", JobsSchema)