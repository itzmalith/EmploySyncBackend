const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',  // Reference to Organization model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
