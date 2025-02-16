const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

// Middleware to check if the request has a valid token
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }
  try {
    // Verify token (ensure you have JWT_SECRET set in your environment)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Populate the user along with their role so we can check capabilities later
    req.user = await User.findById(decoded.id).populate('role');
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Middleware to check if the user has the required capabilities
// Usage: authorize('create:user', 'delete:user') etc.
const authorize = (...requiredCapabilities) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401);
      throw new Error("Not authorized, role missing");
    }
    const userCapabilities = req.user.role.capabilities;
    const hasPermission = requiredCapabilities.every(cap => userCapabilities.includes(cap));
    if (!hasPermission) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
    } else {
      next();
    }
  }
};

module.exports = { protect, authorize };
