const mongoose = require('mongoose')

const organizationSchema = mongoose.Schema({
    name: String,
    image: String,
    url: String,
    users: [{ type: mongoose.ObjectId, ref: "User" }]
})

module.exports = mongoose.model('Organization', organizationSchema)