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
    jobType: {  
        type: String,
        required: true
    },
    salaryPerHour: { 
        type: Number,
        required: true
    },
    yearOfExperience: { 
        type: Number,
        required: true
    },
    skills: [{  
        type: String
    }],
    responsibilities: [{  
        type: String
    }],
    status: {
        type: String,
        required: true,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',  
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Job', jobSchema);
