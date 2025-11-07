const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic user info
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: null
  },
  
  // Enhanced profile data from signup form
  profile: {
    role: String,
    stage: String,
    industry: String,
    incubation: String,
    ideaPitch: String,
    roadblock: String,
    timeline: String,
    needs: [String],
    keywordExecution: String,
    superpower: String,
    confidence: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    workStyle: String,
    motivation: String,
    vibeBadge: String,
    skills: [String],
    collaboration: String,
    hackathonInterest: String,
    badges: [String]
  },
  
  // Company/Startup info
  company: {
    name: String,
    website: String,
    description: String,
    founded: Date,
    teamSize: String,
    location: String
  },
  
  // Contact info
  contact: {
    phone: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private', 'connections'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    }
  },
  
  // Activity tracking
  activity: {
    lastLogin: { type: Date, default: Date.now },
    totalLogins: { type: Number, default: 1 },
    ideasAnalyzed: { type: Number, default: 0 },
    mentorsConnected: { type: Number, default: 0 },
    postsCreated: { type: Number, default: 0 }
  },
  
  // Account status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'active'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 });
userSchema.index({ 'profile.role': 1 });
userSchema.index({ 'profile.industry': 1 });
userSchema.index({ 'profile.stage': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName || this.email.split('@')[0];
});

// Virtual for profile completeness
userSchema.virtual('profileCompleteness').get(function() {
  const profileFields = [
    'role', 'stage', 'industry', 'ideaPitch', 'roadblock', 
    'timeline', 'needs', 'keywordExecution', 'superpower',
    'confidence', 'workStyle', 'motivation', 'vibeBadge', 
    'skills', 'collaboration', 'hackathonInterest'
  ];
  
  const completedFields = profileFields.filter(field => 
    this.profile[field] && 
    (Array.isArray(this.profile[field]) ? this.profile[field].length > 0 : true)
  ).length;
  
  return Math.round((completedFields / profileFields.length) * 100);
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUid = function(uid) {
  return this.findOne({ uid });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ 'profile.role': role });
};

userSchema.statics.findByIndustry = function(industry) {
  return this.find({ 'profile.industry': industry });
};

// Instance methods
userSchema.methods.updateActivity = function() {
  this.activity.lastLogin = Date.now();
  this.activity.totalLogins += 1;
  return this.save();
};

userSchema.methods.incrementIdeasAnalyzed = function() {
  this.activity.ideasAnalyzed += 1;
  return this.save();
};

userSchema.methods.updateProfile = function(profileData) {
  this.profile = { ...this.profile, ...profileData };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
