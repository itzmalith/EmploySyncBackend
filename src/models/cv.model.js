const mongoose = require('mongoose');

const cvSchema = mongoose.Schema({
    user: { type: mongoose.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    location: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    skills: [{ type: String }],
    lookingFor: {
        location: { type: String },
        position: { type: String },
        jobType: { type: String },
        compensationExpectation: { type: String },
        sector: { type: String },
        desiredJob: { type: String }
    },
    experience: [{
        jobTitle: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
    }],
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        startDate: { type: String },
        endDate: { type: String }
    }],
    profileImage: { type: String }
});

module.exports = mongoose.model('Cv', cvSchema);
