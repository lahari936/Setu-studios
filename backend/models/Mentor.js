const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  calendlyUrl: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    default: 'flexible'
  },
  hourlyRate: {
    type: Number
  },
  languages: [{
    type: String,
    trim: true
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  portfolioUrl: {
    type: String,
    trim: true
  },
  resume: {
    type: String, // URL to uploaded resume
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verified: {
    type: Boolean,
    default: false
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  profilePhoto: {
    type: String,
    default: ''
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  verificationToken: {
    type: String,
    unique: true
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

// Update the updatedAt field before saving
mentorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Mentor', mentorSchema);
