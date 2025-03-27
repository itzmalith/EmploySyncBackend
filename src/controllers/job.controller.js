const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Job = require('../models/job.model');

// Applicant applies to a job
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  // Assume userId is passed in the body for this simplified approach
  const { userId } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.appliedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'You have already applied to this job' });
  }

  user.appliedjobs.push(jobId);
  await user.save();

  res.status(200).json({ message: 'Job application submitted successfully' });
});

// Recruiter shortlists an applicant for a job
const shortlistApplicant = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  // Assume applicantId is passed in the request body for this simplified approach
  const { applicantId } = req.body;

  if (!applicantId) {
    return res.status(400).json({ message: 'Applicant ID is required' });
  }

  const user = await User.findById(applicantId);
  if (!user) {
    return res.status(404).json({ message: 'Applicant not found' });
  }

  if (!user.appliedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'This user has not applied to the job' });
  }

  if (user.shortlistedjobs.includes(jobId)) {
    return res.status(400).json({ message: 'Applicant already shortlisted for this job' });
  }

  user.shortlistedjobs.push(jobId);
  await user.save();

  res.status(200).json({ message: 'Applicant shortlisted successfully' });
});

// Get all applicants for a job
const getJobApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const applicants = await User.find({ appliedjobs: jobId }).select('-password');
  res.status(200).json(applicants);
});

// Get all shortlisted applicants for a job
const getShortlistedApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const shortlisted = await User.find({ shortlistedjobs: jobId }).select('-password');
  res.status(200).json(shortlisted);
});

// Get all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('organization', 'name');
  res.status(200).json(jobs);
});

module.exports = {
  applyToJob,
  shortlistApplicant,
  getJobApplicants,
  getShortlistedApplicants,
  getAllJobs
};
