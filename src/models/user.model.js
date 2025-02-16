const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String
    },
    
    organization:{ type: mongoose.ObjectId, ref: "Organization"},

    role: { type: mongoose.ObjectId, ref: "Role", required: true },

    cv: { type: mongoose.ObjectId, ref: "Cv" }
})

module.exports = mongoose.model('User', userSchema)