const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes')
const jobRoutes = require('./organization.routes');
const roleRoutes = require('./role.routes')

router.use('/users', userRoutes)
router.use('/auth' , authRoutes)
router.use('/organization', jobRoutes)
router.use('/role',roleRoutes)

module.exports = router