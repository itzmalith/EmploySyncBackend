const mongoose = require('mongoose')

const organizationSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true
    },
    image: String,
    url:  {
        type: String,
        required: true
    },
    users: [{ type: mongoose.ObjectId, ref: "User" }],
    jobs: [{ type: mongoose.ObjectId, ref: "Job" }]
})

module.exports = mongoose.model('Organization', organizationSchema)