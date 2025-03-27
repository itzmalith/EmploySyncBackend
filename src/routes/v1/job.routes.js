const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/job.controller');

// Get all jobs
router.get('/', jobController.getAllJobs);

// Existing endpoints
router.post('/:jobId/apply', jobController.applyToJob);
router.put('/:jobId/shortlist', jobController.shortlistApplicant);
router.get('/:jobId/applicants', jobController.getJobApplicants);
router.get('/:jobId/shortlisted', jobController.getShortlistedApplicants);

module.exports = router;