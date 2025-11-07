const mongoose = require('mongoose');

const ideaAnalysisSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userUid: {
    type: String,
    required: true,
    index: true
  },
  
  // Idea basic info
  ideaName: {
    type: String,
    required: true,
    trim: true
  },
  ideaDescription: {
    type: String,
    required: true,
    trim: true
  },
  
  // Analysis results from Gemini API
  analysis: {
    executive_summary: {
      overview: String,
      vision: String,
      mission: String
    },
    problem_statement: {
      one_line: String,
      why_it_matters: String
    },
    solution: {
      one_line: String,
      how_it_works: [String],
      benefits: [String]
    },
    unique_selling_proposition: {
      one_line: String,
      key_differentiators: [String]
    },
    market_analysis: {
      target_customer: {
        segment: String,
        persona: String
      },
      market_size_tam_sam_som: {
        TAM: String,
        SAM: String,
        SOM: String
      },
      trends: [String],
      competitors: [{
        name: String,
        strength: String,
        weakness: String
      }]
    },
    business_model: {
      revenue_streams: [String],
      pricing_strategy: String,
      key_partnerships: [String]
    },
    go_to_market_strategy: {
      launch_plan: String,
      distribution_channels: [String],
      early_adopter_strategy: String
    },
    growth_strategy: {
      initial_traction_plan: String,
      scaling_plan: String,
      retention_plan: String
    },
    finance: {
      startup_cost_estimate: String,
      monetization_plan: String,
      funding_stage_and_ask: {
        stage: String,
        amount: String,
        use_of_funds: [String]
      }
    },
    swot_analysis: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String]
    },
    "4ps_marketing_mix": {
      product: String,
      price: String,
      place: String,
      promotion: String
    },
    content_plan_5_days: [{
      day: Number,
      theme: String,
      post_example: String
    }],
    pitch_deck_outline_7_slides: [{
      slide: Number,
      title: String,
      points: [String]
    }],
    elevator_pitch_1_minute: {
      hook: String,
      problem: String,
      solution: String,
      market: String,
      traction_or_potential: String,
      closing: String
    }
  },
  
  // Analysis metadata
  analysisMetadata: {
    geminiModel: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    processingTime: Number, // in milliseconds
    tokensUsed: Number,
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },
  
  // User interaction with analysis
  userInteraction: {
    isBookmarked: { type: Boolean, default: false },
    isShared: { type: Boolean, default: false },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String,
    lastViewed: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 1 }
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived', 'deleted'],
    default: 'completed'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'connections'],
    default: 'private'
  },
  
  // Tags for categorization
  tags: [String],
  
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
ideaAnalysisSchema.index({ userId: 1, createdAt: -1 });
ideaAnalysisSchema.index({ userUid: 1, createdAt: -1 });
ideaAnalysisSchema.index({ ideaName: 'text', ideaDescription: 'text' });
ideaAnalysisSchema.index({ tags: 1 });
ideaAnalysisSchema.index({ status: 1 });
ideaAnalysisSchema.index({ visibility: 1 });
ideaAnalysisSchema.index({ 'analysisMetadata.quality': 1 });

// Virtual for analysis summary
ideaAnalysisSchema.virtual('summary').get(function() {
  return this.analysis?.executive_summary?.overview || 'No summary available';
});

// Virtual for analysis completeness
ideaAnalysisSchema.virtual('completeness').get(function() {
  const requiredFields = [
    'executive_summary', 'problem_statement', 'solution', 
    'market_analysis', 'business_model', 'swot_analysis'
  ];
  
  const completedFields = requiredFields.filter(field => 
    this.analysis && this.analysis[field]
  ).length;
  
  return Math.round((completedFields / requiredFields.length) * 100);
});

// Pre-save middleware
ideaAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-generate tags based on analysis content
  if (this.analysis && !this.tags.length) {
    const tags = [];
    if (this.analysis.market_analysis?.target_customer?.segment) {
      tags.push(this.analysis.market_analysis.target_customer.segment);
    }
    if (this.analysis.business_model?.pricing_strategy) {
      tags.push(this.analysis.business_model.pricing_strategy);
    }
    if (this.analysis.analysis?.industry) {
      tags.push(this.analysis.analysis.industry);
    }
    this.tags = [...new Set(tags)]; // Remove duplicates
  }
  
  next();
});

// Static methods
ideaAnalysisSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  if (options.status) query.status = options.status;
  if (options.visibility) query.visibility = options.visibility;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .populate('userId', 'displayName email photoURL');
};

ideaAnalysisSchema.statics.findByUserUid = function(userUid, options = {}) {
  const query = { userUid };
  if (options.status) query.status = options.status;
  if (options.visibility) query.visibility = options.visibility;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

ideaAnalysisSchema.statics.findPublic = function(options = {}) {
  const query = { visibility: 'public', status: 'completed' };
  if (options.tags && options.tags.length) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .populate('userId', 'displayName photoURL profile.role');
};

ideaAnalysisSchema.statics.searchIdeas = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    visibility: 'public',
    status: 'completed'
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20)
    .populate('userId', 'displayName photoURL profile.role');
};

// Instance methods
ideaAnalysisSchema.methods.incrementViewCount = function() {
  this.userInteraction.viewCount += 1;
  this.userInteraction.lastViewed = Date.now();
  return this.save();
};

ideaAnalysisSchema.methods.addRating = function(rating, feedback = null) {
  this.userInteraction.rating = rating;
  if (feedback) this.userInteraction.feedback = feedback;
  return this.save();
};

ideaAnalysisSchema.methods.toggleBookmark = function() {
  this.userInteraction.isBookmarked = !this.userInteraction.isBookmarked;
  return this.save();
};

ideaAnalysisSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

module.exports = mongoose.model('IdeaAnalysis', ideaAnalysisSchema);
