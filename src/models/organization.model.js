const mongoose = require('mongoose')

const organizationSchema = mongoose.Schema({
    name: String,
    image: String,
    url: String,
    users: [{ type: mongoose.ObjectId, ref: "User" }],
    jobs: [{ type: mongoose.ObjectId, ref: "Job" }]
})

module.exports = mongoose.model('Organization', organizationSchema)