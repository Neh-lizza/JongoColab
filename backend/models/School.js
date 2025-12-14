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