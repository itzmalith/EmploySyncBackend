const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;
