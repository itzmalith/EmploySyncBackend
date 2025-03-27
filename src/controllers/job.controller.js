const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Job = require('../models/job.model');

// @desc    Applicant applies to a job
// @route   POST /api/v1/jobs/:jobId/apply
// @access  Protected (applicants only)
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id; // assuming req.user is set by the protect middleware

  // Ensure the job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Find the applicant
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if already applied
  if (user.appliedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'You have already applied to this job' });
  }

  // Add the job to the appliedjobs array
  user.appliedjobs.push(jobId);
  await user.save();

  res.status(200).json({ message: 'Job application submitted successfully' });
});

// @desc    Recruiter shortlists an applicant for a job
// @route   PUT /api/v1/jobs/:jobId/shortlist
// @access  Protected (recruiters only)
const shortlistApplicant = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { applicantId } = req.body;
  
  if (!applicantId) {
    return res.status(400).json({ message: 'Applicant ID is required' });
  }

  // Find the applicant
  const user = await User.findById(applicantId);
  if (!user) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  // Verify that the applicant has applied to this job
  if (!user.appliedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'This user has not applied to the job' });
  }

  // Check if the applicant is already shortlisted
  if (user.shortlistedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'Applicant already shortlisted for this job' });
  }

  // Add the job to the shortlistedjobs array
  user.shortlistedjobs.push(jobId);
  await user.save();

  res.status(200).json({ message: 'Applicant shortlisted successfully' });
});

// @desc    Get all applicants for a job
// @route   GET /api/v1/jobs/:jobId/applicants
// @access  Protected (recruiters only)
const getJobApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // Query users whose appliedjobs array contains the jobId
  const applicants = await User.find({ appliedjobs: jobId }).select('-password');
  res.status(200).json(applicants);
});

// @desc    Get all shortlisted applicants for a job
// @route   GET /api/v1/jobs/:jobId/shortlisted
// @access  Protected (recruiters only)
const getShortlistedApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // Query users whose shortlistedjobs array contains the jobId
  const shortlisted = await User.find({ shortlistedjobs: jobId }).select('-password');
  res.status(200).json(shortlisted);
});

module.exports = {
  applyToJob,
  shortlistApplicant,
  getJobApplicants,
  getShortlistedApplicants,
};
