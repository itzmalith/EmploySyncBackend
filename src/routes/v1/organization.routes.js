const express = require('express');
const router = express.Router();
const { createJob, updateJob, deleteJob, changeJobStatus } = require('../controllers/organizationController');

router.post('/organizations/:id/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.patch('/jobs/:id/status', changeJobStatus);

module.exports = router;
