const express = require('express');
const router = express.Router();
const { 
    createJob, 
    updateJob, 
    deleteJob, 
    changeJobStatus, 
    createOrganization, 
    getOrganization, 
    updateOrganization, 
    deleteOrganization,
    getOrganizationJobs
     
} = require('../../controllers/organization.controller');

// Organization Routes
router.post('/', createOrganization); // Create an organization
router.get('/:id', getOrganization); // Get an organization by ID
router.put('/:id', updateOrganization); // Update an organization
router.delete('/:id', deleteOrganization); // Delete an organization

// Job Routes within an Organization
router.post('/:id/jobs', createJob); // Create a job under an organization
router.get('/:id/jobs', getOrganizationJobs); 
router.put('/jobs/:id', updateJob); // Update a job
router.delete('/jobs/:id', deleteJob); // Delete a job
router.patch('/jobs/:id/status', changeJobStatus); // Change job status

module.exports = router;
