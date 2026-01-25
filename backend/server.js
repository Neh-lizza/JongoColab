// ===================================
// FIXED server.js - Production Ready
// File: backend/server.js
// ===================================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// ===================================
// MIDDLEWARE - FIXED CORS
// ===================================

// ✅ FIX #1: CORS for both localhost AND production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL || 'https://jongocollab.onrender.com',
      'https://jongocollab.onrender.com'
    ]
  : [
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://localhost:3000'
    ];

console.log('🌐 CORS Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️  CORS Warning - Origin not in whitelist:', origin);
      // In production, still allow for debugging (remove this later)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// ✅ FIX #2: Increase payload limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===================================
// SERVE STATIC FRONTEND FILES
// ===================================

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// ===================================
// API ROUTES (must come before frontend routes)
// ===================================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/collaborations', require('./routes/collaborations'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JongoCollab API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ===================================
// FRONTEND ROUTES - FIXED
// ===================================

// Landing page - Root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// Auth pages
app.get(['/auth', '/auth.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'auth.html'));
});

// Dashboard pages
app.get(['/dashboard', '/student_db.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'student_db.html'));
});

// ✅ FIX #3: Community page - handle BOTH uppercase and lowercase
app.get(['/community', '/community.html', '/Community.html'], (req, res) => {
  // Try lowercase first (Linux), fallback to uppercase (Windows/Mac)
  const lowercasePath = path.join(__dirname, '../frontend', 'community.html');
  const uppercasePath = path.join(__dirname, '../frontend', 'Community.html');
  
  const fs = require('fs');
  if (fs.existsSync(lowercasePath)) {
    res.sendFile(lowercasePath);
  } else if (fs.existsSync(uppercasePath)) {
    res.sendFile(uppercasePath);
  } else {
    res.status(404).send('Community page not found');
  }
});

// Landing/Index pages
app.get(['/index.html', '/landing.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path
  });
});

// Catch-all route - redirect to landing page
app.get('*', (req, res) => {
  console.log('⚠️  404 - Redirecting to landing:', req.path);
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ===================================
// START SERVER
// ===================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 JONGOCOLLAB SERVER RUNNING     ║
╠════════════════════════════════════════╣
║  Server:  http://localhost:${PORT.toString().padEnd(4)}      ║
║  API:     http://localhost:${PORT}/api ║
║  Env:     ${(process.env.NODE_ENV || 'development').padEnd(11)} ║
║  Status:  ✅ ACTIVE                    ║
╚════════════════════════════════════════╝
  `);
  console.log(`\n📁 Serving Frontend:`);
  console.log(`   🌐 Landing:   http://localhost:${PORT}`);
  console.log(`   🔐 Auth:      http://localhost:${PORT}/auth.html`);
  console.log(`   📊 Dashboard: http://localhost:${PORT}/student_db.html`);
  console.log(`   👥 Community: http://localhost:${PORT}/community.html`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/posts`);
  console.log(`   POST   /api/posts`);
  console.log(`   GET    /api/posts/:id`);
  console.log(`   PUT    /api/posts/:id`);
  console.log(`   DELETE /api/posts/:id`);
  console.log(`   POST   /api/posts/:id/like`);
  console.log(`   POST   /api/posts/:id/comment`);
  console.log(`   POST   /api/posts/:id/collaborate`);
  console.log(`\n🔧 Environment Variables:`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   JWT_SECRET:  ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`\n🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
