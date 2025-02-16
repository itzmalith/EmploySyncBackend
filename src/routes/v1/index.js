const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes')
const jobRoutes = require('./routes/jobRoutes');

router.use('/users', userRoutes)
router.use('/auth' , authRoutes)
router.use('/organization', jobRoutes)
module.exports = router