// ===================================
// UPDATED server.js - Serve Frontend + Posts API
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
// MIDDLEWARE
// ===================================

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================
// SERVE STATIC FRONTEND FILES
// ===================================

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve CSS files
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));

// Serve JS files
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// Serve images
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// ===================================
// API ROUTES (must come before frontend routes)
// ===================================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/posts', require('./routes/posts')); // Add posts routes

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JongoCollab API is running',
    timestamp: new Date().toISOString()
  });
});

// ===================================
// FRONTEND ROUTES (HTML pages)
// ===================================

// Landing page - Root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// Auth page
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'auth.html'));
});

app.get('/auth.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'auth.html'));
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'student_db.html'));
});

app.get('/student_db.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'student_db.html'));
});

// Community page
app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'community.html'));
});

app.get('/community.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'community.html'));
});

// Index/Landing page
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

app.get('/landing.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Catch-all route - redirect to landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
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
║  Server:  http://localhost:${PORT}      ║
║  API:     http://localhost:${PORT}/api ║
║  Status:  ✅ ACTIVE                    ║
╚════════════════════════════════════════╝
  `);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Landing page: http://localhost:${PORT}`);
  console.log(`🔐 Auth page: http://localhost:${PORT}/auth.html`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/student_db.html`);
  console.log(`👥 Community: http://localhost:${PORT}/community.html`);
  console.log(`\n📡 Available API Endpoints:`);
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
});

module.exports = app;