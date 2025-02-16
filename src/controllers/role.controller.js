const asyncHandler = require('express-async-handler');
const Role = require('../models/role.model');
const i18n = require('i18n');
const logger = require('../utils/log4jsutil');
const AppError = require('../utils/app.error');

// @desc    Create a new role with capabilities
// @route   POST /api/v1/roles
// @access  Private
const createRole = asyncHandler(async (req, res) => {
    logger.trace('[roleController] :: createRole() : Start');
    const { name, capabilities } = req.body;

    if (!name || !capabilities) {
        logger.error('[roleController] :: createRole() : Missing required fields');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }

    // Convert capabilities to an array if passed as a comma separated string
    let capabilitiesArray;
    if (typeof capabilities === 'string') {
        capabilitiesArray = capabilities.split(',').map(s => s.trim());
    } else if (Array.isArray(capabilities)) {
        capabilitiesArray = capabilities;
    } else {
        logger.error('[roleController] :: createRole() : Invalid type for capabilities');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }

    // Optionally, check if a role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
        logger.error('[roleController] :: createRole() : Role already exists');
        throw new AppError(400, i18n.__('ROLE_ALREADY_EXISTS'));
    }

    const role = await Role.create({ name, capabilities: capabilitiesArray });
    res.status(201).json(role);
    logger.trace('[roleController] :: createRole() : End');
});

// @desc    Update an existing role
// @route   PUT /api/v1/roles/:id
// @access  Private
const updateRole = asyncHandler(async (req, res) => {
    logger.trace('[roleController] :: updateRole() : Start');
    const roleId = req.params.id;
    const { name, capabilities } = req.body;
    
    let capabilitiesArray;
    if (capabilities) {
        if (typeof capabilities === 'string') {
            capabilitiesArray = capabilities.split(',').map(s => s.trim());
        } else if (Array.isArray(capabilities)) {
            capabilitiesArray = capabilities;
        } else {
            logger.error('[roleController] :: updateRole() : Invalid type for capabilities');
            throw new AppError(400, i18n.__('BAD_REQUEST'));
        }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (capabilitiesArray) updateData.capabilities = capabilitiesArray;

    const role = await Role.findByIdAndUpdate(roleId, updateData, { new: true });
    if (!role) {
        logger.error('[roleController] :: updateRole() : Role not found');
        throw new AppError(404, i18n.__('ROLE_NOT_FOUND'));
    }

    res.status(200).json(role);
    logger.trace('[roleController] :: updateRole() : End');
});

// @desc    Delete an existing role
// @route   DELETE /api/v1/roles/:id
// @access  Private
const deleteRole = asyncHandler(async (req, res) => {
    logger.trace('[roleController] :: deleteRole() : Start');
    const roleId = req.params.id;

    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
        logger.error('[roleController] :: deleteRole() : Role not found');
        throw new AppError(404, i18n.__('ROLE_NOT_FOUND'));
    }

    res.status(200).json({ message: 'Role deleted successfully' });
    logger.trace('[roleController] :: deleteRole() : End');
});

module.exports = {
    createRole,
    updateRole,
    deleteRole
};
