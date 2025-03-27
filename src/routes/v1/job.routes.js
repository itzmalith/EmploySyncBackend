const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/job.controller');


// Applicant applies to a job
router.post('/:jobId/apply',   jobController.applyToJob);

// Recruiter shortlists an applicant
router.put('/:jobId/shortlist',  jobController.shortlistApplicant);

// Get all applicants for a job
router.get('/:jobId/applicants',  jobController.getJobApplicants);

// Get all shortlisted applicants for a job
router.get('/:jobId/shortlisted', jobController.getShortlistedApplicants);

module.exports = router;
