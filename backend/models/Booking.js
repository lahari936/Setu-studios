const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  mentee: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    company: {
      type: String
    }
  },
  sessionDetails: {
    type: {
      type: String,
      enum: ['video-call', 'phone-call', 'in-person'],
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 60
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    scheduledTime: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      default: '37005'
    },
    meetingLink: {
      type: String
    },
    meetingNotes: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    }
  },
  calendlyEventId: {
    type: String
  },
  calendlyInviteeUri: {
    type: String
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
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
