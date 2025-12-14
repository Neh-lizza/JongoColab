// ===================================
// BACKEND STRUCTURE FOR JONGOCOLLAB
// ===================================

/*
FOLDER STRUCTURE:
backend/
├── server.js (main entry point)
├── .env
├── package.json
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── School.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   └── admin.js
├── middleware/
│   └── auth.js
└── utils/
    └── email.js (optional)
*/

// ========================================
// 1. package.json
// ========================================
/*
{
  "name": "jongocollab-backend",
  "version": "1.0.0",
  "description": "Backend for JongoCollab student collaboration platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
*/

// ========================================
// 2. .env (Environment Variables)
// ========================================
/*
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jongocollab
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
*/

// ========================================
// 3. config/db.js (Database Connection)
// ========================================
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// ========================================
// 4. models/User.js (User Schema)
// ========================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['student', 'supervisor', 'admin'],
    default: 'student'
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: [true, 'School is required']
  },
  schoolName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ['software', 'ai', 'networking', 'hardware', 'other'],
    required: [true, 'Department is required']
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// ========================================
// 5. models/School.js (School Schema)
// ========================================
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  logo: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#CC00FF'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('School', schoolSchema);

// ========================================
// 6. middleware/auth.js (JWT Middleware)
// ========================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is approved
    if (req.user.approvalStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
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

// ========================================
// 7. routes/auth.js (Authentication Routes)
// ========================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const School = require('../models/School');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user (pending approval)
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('schoolName').notEmpty().withMessage('School is required'),
  body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
  try {
    // Validate input
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
      // Create new school if it doesn't exist
      school = await School.create({
        name: schoolName,
        abbreviation: schoolName.substring(0, 4).toUpperCase()
      });
    }

    // Create new user (status: pending)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      school: school._id,
      schoolName: school.name,
      department,
      approvalStatus: 'pending',
      role: 'student'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
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

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check approval status
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

    // Generate token
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

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('school', 'name abbreviation');

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        school: user.school,
        department: user.department,
        approvalStatus: user.approvalStatus,
        profilePicture: user.profilePicture
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

// ========================================
// 8. routes/admin.js (Admin Routes)
// ========================================
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/admin/pending-users
// @desc    Get all pending approval users
// @access  Private/Admin
router.get('/pending-users', protect, isAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/approve-user/:id
// @desc    Approve user registration
// @access  Private/Admin
router.put('/approve-user/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.approvalStatus = 'approved';
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/reject-user/:id
// @desc    Reject user registration
// @access  Private/Admin
router.delete('/reject-user/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.approvalStatus = 'rejected';
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User rejected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

// ========================================
// 9. server.js (Main Server File)
// ========================================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JongoCollab API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

// ========================================
// 10. INSTALLATION & SETUP INSTRUCTIONS
// ========================================
/*

STEP 1: Create backend folder and initialize
-----------------------------------------
mkdir backend
cd backend
npm init -y

STEP 2: Install dependencies
-----------------------------------------
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator
npm install --save-dev nodemon

STEP 3: Create folder structure
-----------------------------------------
mkdir config models routes middleware utils
touch server.js .env

STEP 4: Create all the files above
-----------------------------------------
- Copy each section into respective files
- Make sure folder structure matches

STEP 5: Configure MongoDB
-----------------------------------------
Option A: Local MongoDB
- Install MongoDB locally
- Use: mongodb://localhost:27017/jongocollab

Option B: MongoDB Atlas (Cloud)
- Create free account at mongodb.com/atlas
- Get connection string
- Use in .env: mongodb+srv://username:password@cluster.mongodb.net/jongocollab

STEP 6: Update .env file
-----------------------------------------
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=create_a_super_long_random_string_min_32_characters
JWT_EXPIRES_IN=7d
NODE_ENV=development

STEP 7: Start the server
-----------------------------------------
npm run dev

STEP 8: Test API endpoints
-----------------------------------------
# Register new user
POST http://localhost:5000/api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "schoolName": "MIT",
  "department": "software"
}

# Login (will fail until admin approves)
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}

STEP 9: Create first admin user manually in MongoDB
-----------------------------------------
Use MongoDB Compass or mongosh:
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@jongocollab.com",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "admin",
  approvalStatus: "approved",
  schoolName: "JongoCollab",
  department: "other",
  createdAt: new Date()
})

*/