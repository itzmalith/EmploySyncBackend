const asyncHandler = require('express-async-handler');
const Job = require('../models/job.model');
i18n = require('i18n');
const logger = require('../utils/log4jsutil');
const AppError = require('../utils/app.error');

// @desc    Create a job
// @route   POST /api/v1/organizations/:id/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: createJob() : Start');
    if (!req.body) {
        logger.error('[organizationController] :: createJob() : Request body is null');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }
    
    const organizationId = req.params.id;
    const job = await Job.create({ organization: organizationId, ...req.body });
    res.status(201).json(job);
    logger.trace('[organizationController] :: createJob() : End');
});

// @desc    Update a job
// @route   PUT /api/v1/organization/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: updateJob() : Start');
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
        logger.error('[organizationController] :: updateJob() : Job not found');
        throw new AppError(404, 'Job not found');
    }
    res.status(200).json(job);
    logger.trace('[organizationController] :: updateJob() : End');
});

// @desc    Delete a job
// @route   DELETE /api/v1/organization/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: deleteJob() : Start');
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
        logger.error('[organizationController] :: deleteJob() : Job not found');
        throw new AppError(404, 'Job not found');
    }
    res.status(200).json({ message: 'Job deleted successfully' });
    logger.trace('[organizationController] :: deleteJob() : End');
});

// @desc    Change job status
// @route   PATCH /api/v1/organization/jobs/:id/status
// @access  Private
const changeJobStatus = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: changeJobStatus() : Start');
    const job = await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!job) {
        logger.error('[organizationController] :: changeJobStatus() : Job not found');
        throw new AppError(404, 'Job not found');
    }
    res.status(200).json(job);
    logger.trace('[organizationController] :: changeJobStatus() : End');
});

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    changeJobStatus
};
