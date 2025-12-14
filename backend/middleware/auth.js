// ===================================
// FIXED backend/middleware/auth.js
// With detailed debugging
// ===================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Has Authorization header:', !!req.headers.authorization);
    console.log('Token extracted:', token ? 'YES' : 'NO');

    if (!token) {
      console.log('ERROR: No token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.id });
    } catch (jwtError) {
      console.log('ERROR: Token verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token'
      });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('ERROR: User not found in database for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', {
      id: req.user._id,
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`,
      approvalStatus: req.user.approvalStatus
    });

    // CRITICAL FIX: Check if user is approved
    if (req.user.approvalStatus !== 'approved') {
      console.log('ERROR: User not approved. Status:', req.user.approvalStatus);
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval',
        approvalStatus: req.user.approvalStatus
      });
    }

    console.log('Auth successful - proceeding to route handler');
    console.log('=== END AUTH DEBUG ===\n');

    next();
  } catch (error) {
    console.log('ERROR: Unexpected auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Check if user is supervisor
const isSupervisor = (req, res, next) => {
  if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Supervisor only.'
    });
  }
  next();
};

module.exports = { protect, isAdmin, isSupervisor };