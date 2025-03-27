const asyncHandler = require('express-async-handler');
const Job = require('../models/job.model');
const Organization = require('../models/organization.model');
const i18n = require('i18n');
const logger = require('../utils/log4jsutil');
const AppError = require('../utils/app.error');

// @desc    Create a job
// @route   POST /api/v1/organization/:id/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: createJob() : Start');

    if (!req.body || Object.keys(req.body).length === 0) {
        logger.error('[organizationController] :: createJob() : Request body is empty');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }
    
    const organizationId = req.params.id;
    
    // Ensure organization exists before creating a job
    const organization = await Organization.findById(organizationId);
    if (!organization) {
        logger.error(`[organizationController] :: createJob() : Organization with ID ${organizationId} not found`);
        throw new AppError(404, 'Organization not found');
    }

    const job = await Job.create({ organization: organizationId, ...req.body });

    res.status(201).json(job);
    logger.trace('[organizationController] :: createJob() : End');
});

// @desc    Get all jobs for an organization
// @route   GET /api/v1/organization/:id/jobs
// @access  Private
// @desc    Get all jobs for an organization
// @route   GET /api/v1/organization/:id/jobs
// @access  Private
const getOrganizationJobs = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: getOrganizationJobs() : Start');
    
    const organizationId = req.params.id;
    
    // Fetch all jobs associated with the given organization ID
    const jobs = await Job.find({ organization: organizationId });

    if (!jobs || jobs.length === 0) {
        logger.error(`[organizationController] :: getOrganizationJobs() : No jobs found for organization with ID ${organizationId}`);
        throw new AppError(404, 'No jobs found for this organization');
    }

    res.status(200).json(jobs);
    logger.trace('[organizationController] :: getOrganizationJobs() : End');
});




// @desc    Update a job
// @route   PUT /api/v1/organization/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: updateJob() : Start');

    if (!req.body || Object.keys(req.body).length === 0) {
        logger.error('[organizationController] :: updateJob() : Request body is empty');
        throw new AppError(400, 'Invalid request data');
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!job) {
        logger.error(`[organizationController] :: updateJob() : Job with ID ${req.params.id} not found`);
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
        logger.error(`[organizationController] :: deleteJob() : Job with ID ${req.params.id} not found`);
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

    if (!req.body || !req.body.status) {
        logger.error('[organizationController] :: changeJobStatus() : Status is missing');
        throw new AppError(400, 'Job status is required');
    }

    const job = await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

    if (!job) {
        logger.error(`[organizationController] :: changeJobStatus() : Job with ID ${req.params.id} not found`);
        throw new AppError(404, 'Job not found');
    }

    res.status(200).json(job);
    logger.trace('[organizationController] :: changeJobStatus() : End');
});

// @desc    Create an organization
// @route   POST /api/v1/organization
// @access  Private
const createOrganization = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: createOrganization() : Start');

    if (!req.body || Object.keys(req.body).length === 0) {
        logger.error('[organizationController] :: createOrganization() : Request body is empty');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }

    const organization = await Organization.create(req.body);

    res.status(201).json(organization);
    logger.trace('[organizationController] :: createOrganization() : End');
});

// @desc    Get an organization by ID
// @route   GET /api/v1/organization/:id
// @access  Private
const getOrganization = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: getOrganization() : Start');
    
    const organization = await Organization.findById(req.params.id).populate('users jobs');
    
    if (!organization) {
        logger.error(`[organizationController] :: getOrganization() : Organization with ID ${req.params.id} not found`);
        throw new AppError(404, 'Organization not found');
    }

    res.status(200).json(organization);
    logger.trace('[organizationController] :: getOrganization() : End');
});
// @desc    Update an organization
// @route   PUT /api/v1/organization/:id
// @access  Private
const updateOrganization = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: updateOrganization() : Start');

    if (!req.body || Object.keys(req.body).length === 0) {
        logger.error('[organizationController] :: updateOrganization() : Request body is empty');
        throw new AppError(400, 'Invalid request data');
    }

    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!organization) {
        logger.error(`[organizationController] :: updateOrganization() : Organization with ID ${req.params.id} not found`);
        throw new AppError(404, 'Organization not found');
    }

    res.status(200).json(organization);
    logger.trace('[organizationController] :: updateOrganization() : End');
});

// @desc    Delete an organization
// @route   DELETE /api/v1/organization/:id
// @access  Private
const deleteOrganization = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: deleteOrganization() : Start');

    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
        logger.error(`[organizationController] :: deleteOrganization() : Organization with ID ${req.params.id} not found`);
        throw new AppError(404, 'Organization not found');
    }

    res.status(200).json({ message: 'Organization deleted successfully' });
    logger.trace('[organizationController] :: deleteOrganization() : End');
});

// @desc    Get all jobs across all organizations
// @route   GET /api/v1/organization/jobs
// @access  Private
const getAllJobs = asyncHandler(async (req, res) => {
    logger.trace('[organizationController] :: getAllJobs() : Start');

    const jobs = await Job.find().populate('organization');

    if (!jobs || jobs.length === 0) {
        logger.error('[organizationController] :: getAllJobs() : No jobs found');
        throw new AppError(404, 'No jobs found');
    }

    res.status(200).json(jobs);
    logger.trace('[organizationController] :: getAllJobs() : End');
});

module.exports = {
    createJob,
    getOrganizationJobs,
    updateJob,
    deleteJob,
    changeJobStatus,
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    getAllJobs,
};