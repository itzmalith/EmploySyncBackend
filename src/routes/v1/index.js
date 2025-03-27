const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes')
const organizationRoutes = require('./organization.routes');
const roleRoutes = require('./role.routes')
const jobRoutes = require('./job.routes')

router.use('/users', userRoutes)
router.use('/auth' , authRoutes)
router.use('/organization', organizationRoutes)
router.use('/role',roleRoutes)
router.use('/job',jobRoutes)

module.exports = router