// ===================================
// UPDATED backend/routes/auth.js
// With auto-approve option for testing
// ===================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const School = require('../models/School');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ===================================
// REGISTER - AUTO APPROVE FOR TESTING
// ===================================
router.post('/register', [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('schoolName').notEmpty(),
  body('department').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, schoolName, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Find or create school
    let school = await School.findOne({ name: schoolName });
    if (!school) {
      school = await School.create({
        name: schoolName,
        abbreviation: schoolName.substring(0, 4).toUpperCase()
      });
    }

    // ===================================
    // AUTO-APPROVE LOGIC
    // ===================================
    // Option 1: Auto-approve everyone (for testing/development)
    const autoApprove = process.env.AUTO_APPROVE === 'true';
    
    // Option 2: Auto-approve specific domains (for production)
    const autoApproveDomains = process.env.AUTO_APPROVE_DOMAINS 
      ? process.env.AUTO_APPROVE_DOMAINS.split(',') 
      : [];
    const emailDomain = email.split('@')[1];
    const shouldAutoApprove = autoApprove || autoApproveDomains.includes(emailDomain);
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      schoolName: school.name,
      department,
      approvalStatus: shouldAutoApprove ? 'approved' : 'pending',
      role: 'student'
    });

    // If auto-approved, return token immediately
    if (shouldAutoApprove) {
      const token = generateToken(user._id);
      
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to JongoCollab.',
        autoApproved: true,
        data: {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            school: user.schoolName,
            department: user.department,
            approvalStatus: user.approvalStatus
          }
        }
      });
    }

    // Otherwise, return pending status
    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      autoApproved: false,
      data: {
        userId: user._id,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// ===================================
// LOGIN
// ===================================
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.approvalStatus === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for approval.',
        approvalStatus: 'pending'
      });
    }

    if (user.approvalStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account registration was rejected. Please contact support.',
        approvalStatus: 'rejected'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          school: user.schoolName,
          department: user.department,
          approvalStatus: user.approvalStatus
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ===================================
// GET CURRENT USER
// ===================================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        school: user.schoolName,
        department: user.department,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;