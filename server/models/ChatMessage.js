const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  },
  adminReply: {
    type: String
  },
  repliedAt: {
    type: Date
  }
});

// Index for efficient queries
chatMessageSchema.index({ sessionId: 1, timestamp: -1 });
chatMessageSchema.index({ read: 1 });
chatMessageSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

