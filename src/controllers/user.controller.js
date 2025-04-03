const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const i18n = require("i18n");
const logger = require('../utils/log4jsutil');
const AppError = require('../utils/app.error');
const Status = require('../utils/status.js');
const constants = require('../utils/constants.js')
const mongoose = require('mongoose');
const path = require('path');
const mime = require('mime-types')
const { v1: uuidv1 } = require('uuid');
const config = require('config');
const basicUtil = require("../utils/basic.util.js");
const { log } = require('console');
const Role = require('../models/role.model'); 
const Cv = require('../models/cv.model.js') 

// @desc    Authenticate a user
// @route   GET /api/v1/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    logger.trace("userController] :: getUsers() : Start"); 
    const users = await User.find().select('-password');
    res.status(200).json(users);
    logger.trace("[userController] :: getUsers() : End"); 
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
const getUserById = asyncHandler(async (req, res, next) => {
    logger.trace("[userController] :: getUserById() : Start");
  
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  

      res.status(200).json(user);
    } catch (error) {
      next(error); 
    }
  });

// @desc    create a user
// @route   POST /api/v1/users
// @access  Public

const createUser = asyncHandler(async (req, res) => {
    logger.trace("[userController] :: createUser() : Start");

    const { userName, email, password, profileImage, organization, role, cv, appliedjobs, shortlistedjobs } = req.body;

    if (!userName || !email || !password || !role) {
        logger.error("[userController] :: createUser() : Missing required field");
        throw new AppError(400, "Missing required fields");
    }

    const userNameRegex = /^[^\s]{4,100}$/;
    if (!userNameRegex.test(userName)) {
        logger.error("[userController] :: createUser() : Invalid username format");
        throw new AppError(400, "Invalid username format");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        logger.error("[userController] :: createUser() : Email already exists");
        throw new AppError(400, "User with this email already exists");
    }

    const emailRegex = /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,6})$/;
    if (!emailRegex.test(email)) {
        logger.error("[userController] :: createUser() : Invalid email format");
        throw new AppError(400, "Invalid email format");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        userName,
        email,
        password: hashedPassword,
        profileImage,
        organization,
        role,
        cv,
        appliedjobs: appliedjobs || [],
        shortlistedjobs: shortlistedjobs || []
    });

    logger.trace("[userController] :: createUser() : User created successfully");
    res.status(201).json({
        message: "User created successfully",
        user,
    });

    logger.trace("[userController] :: createUser() : End");
});


// @desc    Update application status for a specific job for a user
// @route   PATCH /api/v1/users/:id/application-status
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: updateApplicationStatus() : Start');

    const userId = req.params.id;
    const { jobId, status } = req.body;

    if (!jobId || !status) {
        logger.error('[userController] :: updateApplicationStatus() : Job ID and status are required');
        throw new AppError(400, "Job ID and status are required");
    }

    const user = await User.findById(userId);
    if (!user) {
        logger.error('[userController] :: updateApplicationStatus() : User not found');
        throw new AppError(404, "User not found");
    }

    // Remove the job ID from both shortlisted and rejected arrays if it exists.
    user.shortlistedjobs = user.shortlistedjobs.filter(id => id.toString() !== jobId);
    user.rejectedjobs = user.rejectedjobs.filter(id => id.toString() !== jobId);

    if (status === 'accepted') {
        user.shortlistedjobs.push(jobId);
    } else if (status === 'rejected') {
        user.rejectedjobs.push(jobId);
    } else {
        logger.error('[userController] :: updateApplicationStatus() : Invalid status');
        throw new AppError(400, "Invalid status");
    }

    await user.save();
    logger.trace('[userController] :: updateApplicationStatus() : End');
    res.status(200).json({ message: "Application status updated", user });
});


// @desc    edit a user
// @route   PUT /api/v1/users/:id
// @access  Private
// @desc    Edit a user
// @route   PUT /api/v1/users/:id
// @access  Private
const editUser = asyncHandler(async (req, res) => {
    logger.trace("[userController] :: editUser() : Start");

    const userId = req.body.userId;
    if (!userId) {
        logger.error("[userController] :: editUser() : user id is a must");
        throw new AppError(400, i18n.__("UNAUTHORIZED"));
    }

    // Build the updates object with conditional properties
    let updates = {
        ...(req.body.userName !== null && req.body.userName !== "" && { userName: req.body.userName }),
        ...(req.body.email !== null && req.body.email !== "" && { email: req.body.email }),
        ...(req.body.profileImage !== null && req.body.profileImage !== "" && { profileImage: req.body.profileImage }),
        ...(req.body.organization !== null && req.body.organization !== "" && { organization: req.body.organization }),
        ...(req.body.role !== null && req.body.role !== "" && { role: req.body.role }),
        ...(req.body.cv !== null && req.body.cv !== "" && { cv: req.body.cv }),
        ...(req.body.appliedjobs && Array.isArray(req.body.appliedjobs) && { appliedjobs: req.body.appliedjobs }),
        ...(req.body.shortlistedjobs && Array.isArray(req.body.shortlistedjobs) && { shortlistedjobs: req.body.shortlistedjobs })
    };

    // Validate the userName if provided
    if (updates.userName) {
        const userNameRegex = /^[^\s]{4,100}$/;
        if (!userNameRegex.test(updates.userName)) {
            logger.error("[userController] :: editUser() : Invalid username format");
            throw new AppError(400, i18n.__("ERROR_INVALID_USERNAME_FORMAT"));
        }

        // Check if the new userName already exists for another user
        const userNameExists = await User.find({
            userName: updates.userName,
            _id: { $ne: userId }
        });
        if (userNameExists.length > 0) {
            logger.error("[userController] :: editUser() : Username already exists");
            throw new AppError(400, i18n.__("ERROR_USER_ALREADY_EXISTS"));
        }
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
        logger.error("[userController] :: editUser() : User not found");
        throw new AppError(404, i18n.__("ERROR_USER_NOT_FOUND"));
    }

    logger.trace("[userController] :: editUser() : End");
    res.status(200).json({ data: updatedUser });
});


// @desc Delete user
// @route DELETE /api/v1/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    logger.trace("[userController] :: deleteUser() : Start");

    const userId = req.params.id;

    const result = await User.deleteOne({ _id: userId })

    if (!result.deletedCount) {
        logger.error("[userController] :: deleteUser() : No users with the given id");
        throw new AppError(404, i18n.__("USER_NOT_FOUND"))
    }
    res.status(200).json({ payload: null, status: Status.getSuccessStatus(i18n.__("DELETE_SUCCESS")) });
    logger.trace("[userController] :: deleteUser() : End");
})

// @desc    Get user's CV
// @route   GET /api/v1/users/:id/cv
const getUserCv = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: getUserCv() : Start');

    const userId = req.params.id;

    if (!userId) {
        logger.error('[userController] :: getUserCv() : Missing user ID');
        return res.status(400).json({ message: 'User ID is required' });
    }

    // First, find the role of the user
    const userCv = await Cv.findOne({ user: userId });

    if (!userCv) {
        logger.error('[userController] :: getUserCv() : Role not found for user');
        throw new AppError(404, 'User role not found');
    }

    

    res.status(200).json(userCv);
    logger.trace('[userController] :: getUserCv() : End');
});

// @desc    Get user's Organization
// @route   GET /api/v1/users/:id/organization
const getUserOrganization = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: getUserOrganization() : Start');
    
    const userId = req.params.id;
    const user = await User.findById(userId).populate('organization').select('-password');

    if (!user) {
        logger.error('[userController] :: getUserOrganization() : User not found');
        throw new AppError(404, 'User not found');
    }

    res.status(200).json(user.organization);
    logger.trace('[userController] :: getUserOrganization() : End');
});

// @desc    Create user CV
// @route   POST /api/v1/users/:id/cv
// @access  Private
const createUserCv = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: createUserCv() : Start');
    if (!req.body) {
        logger.error('[userController] :: createUserCv() : Request body is null');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }
    
    const userId = req.params.id;
    const existingCv = await Cv.findOne({ user: userId });
    
    if (existingCv) {
        logger.error('[userController] :: createUserCv() : CV already exists for user');
        throw new AppError(400, i18n.__('DUPLICATE_CV'));
    }

    const newCv = await Cv.create({ user: userId, ...req.body });
    
    if (!newCv) {
        logger.error('[userController] :: createUserCv() : CV creation failed');
        throw new AppError(500, i18n.__('APPLICATION_ERROR'));
    }

    res.status(201).json(newCv);
    logger.trace('[userController] :: createUserCv() : End');
});

// @desc    Update user CV
// @route   PUT /api/v1/users/:id/cv
// @access  Private
const updateUserCv = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: updateUserCv() : Start');
    if (!req.body) {
        logger.error('[userController] :: updateUserCv() : Request body is null');
        throw new AppError(400, i18n.__('BAD_REQUEST'));
    }
    
    const userId = req.params.id;
    const updatedCv = await Cv.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true, upsert: true }
    );
    
    if (!updatedCv) {
        logger.error('[userController] :: updateUserCv() : Failed to update CV');
        throw new AppError(500, 'Failed to update CV');
    }
    
    res.status(200).json(updatedCv);
    logger.trace('[userController] :: updateUserCv() : End');
});


// @desc    Delete user CV
// @route   DELETE /api/v1/users/:id/cv
const deleteUserCv = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: deleteUserCv() : Start');
    
    const userId = req.params.id;
    const result = await Cv.deleteOne({ user: userId });
    
    if (!result.deletedCount) {
        logger.error('[userController] :: deleteUserCv() : No CV found');
        throw new AppError(404, 'CV not found');
    }
    
    res.status(200).json({ message: 'CV deleted successfully' });
    logger.trace('[userController] :: deleteUserCv() : End');
});

// @desc    Get all recruiters
// @route   GET http://127.0.0.1:3000/api/v1/users/get/recruiters
// @access  Public
const getRecruiters = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: getRecruiters() : Start');
    try {
        // Find the role ID for "recruiter"
        const recruiterRole = await Role.findOne({ name: "recruiter" });

        if (!recruiterRole) {
            return res.status(404).json({ message: "Recruiter role not found" });
        }

        // Find all users with that role
        const recruiters = await User.find({ role: recruiterRole._id }).select('-password');

        if (recruiters.length === 0) {
            return res.status(404).json({ message: "No recruiters found" });
        }

        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
    logger.trace('[userController] :: getRecruiters() : End');
});

// @desc    Get all applicants
// @route   GET http://127.0.0.1:3000/api/v1/users/get/applicants
// @access  Public
const getApplicants = asyncHandler(async (req, res) => {
    logger.trace('[userController] :: getApplicants() Start');
    try {
        // Find the role ID for "applicant"
        console.log("test1");
        const applicantRole = await Role.findOne({ name: "applicant" });
        console.log("test2");
        

        if (!applicantRole || !applicantRole._id) {
            return res.status(404).json({ message: "Applicant role not found" });
        }else{
            console.log("found");
        }

        // Find all users with that role
        const applicants = await User.find({ role: applicantRole._id }).select('-password');

        if (!applicants || applicants.length === 0) {
            return res.status(404).json({ message: "No applicants found" });
        }

        res.status(200).json(applicants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
    logger.trace('[userController] :: getApplicants() End');
});

module.exports = {
    getApplicants,
    getRecruiters,
    createUser,
    editUser,
    deleteUser,
    getUsers,
    getUserById,
    getUserCv,
    getUserOrganization,
    createUserCv,
    updateUserCv,
    deleteUserCv,
    updateApplicationStatus 

}