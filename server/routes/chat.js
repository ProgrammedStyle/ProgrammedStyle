const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/chat/messages
 * @desc    Get all chat messages (Admin only)
 * @access  Private (Admin)
 */
router.get('/messages', authenticate, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, unreadOnly = false } = req.query;
    
    const query = unreadOnly === 'true' ? { read: false } : {};
    
    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ChatMessage.countDocuments(query);
    
    res.json({
      success: true,
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/chat/messages/session/:sessionId
 * @desc    Get chat messages by session ID
 * @access  Public
 */
router.get('/messages/session/:sessionId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ 
      sessionId: req.params.sessionId 
    }).sort({ timestamp: 1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get session messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/chat/messages/:id/read
 * @desc    Mark message as read (Admin only)
 * @access  Private (Admin)
 */
router.put('/messages/:id/read', authenticate, isAdmin, async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/chat/messages/:id/reply
 * @desc    Reply to a chat message (Admin only)
 * @access  Private (Admin)
 */
router.post('/messages/:id/reply', authenticate, isAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ error: 'Reply text is required' });
    }
    
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: reply,
        replied: true,
        repliedAt: new Date(),
        read: true
      },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Emit reply via Socket.IO
    const io = require('../server').io;
    if (io) {
      io.of('/chat').to(message.sessionId).emit('adminReply', {
        messageId: message._id,
        reply,
        repliedAt: message.repliedAt
      });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/chat/stats
 * @desc    Get chat statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalMessages = await ChatMessage.countDocuments();
    const unreadMessages = await ChatMessage.countDocuments({ read: false });
    const repliedMessages = await ChatMessage.countDocuments({ replied: true });
    
    res.json({
      success: true,
      stats: {
        total: totalMessages,
        unread: unreadMessages,
        replied: repliedMessages,
        pending: totalMessages - repliedMessages
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

