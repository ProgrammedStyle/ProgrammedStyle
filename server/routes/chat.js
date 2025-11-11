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
    const { page = 1, limit = 1000, unreadOnly = false } = req.query;
    
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
    
    // Get the original message to get session and user info
    const originalMessage = await ChatMessage.findById(req.params.id);
    
    if (!originalMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Mark original message as read
    originalMessage.read = true;
    await originalMessage.save();
    
    // Create a new message for the admin reply
    const adminReplyMessage = new ChatMessage({
      name: 'Admin',
      email: 'admin@programmedstyle.com',
      message: reply,
      sessionId: originalMessage.sessionId,
      timestamp: new Date(),
      read: true,
      replied: false,
      isAdminMessage: true
    });
    
    await adminReplyMessage.save();
    
    // Emit reply via Socket.IO to both user and admin
    const io = require('../server').io;
    if (io) {
      const chatNamespace = io.of('/chat');
      // Send to user's session
      chatNamespace.to(originalMessage.sessionId).emit('adminReply', {
        reply,
        repliedAt: adminReplyMessage.timestamp
      });
      // Also send to admin room for real-time dashboard update
      chatNamespace.to('admin').emit('newMessage', adminReplyMessage);
    }
    
    res.json({ success: true, message: adminReplyMessage });
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

/**
 * @route   DELETE /api/chat/session/:sessionId
 * @desc    Delete all messages in a session (Admin only)
 * @access  Private (Admin)
 */
router.delete('/session/:sessionId', authenticate, isAdmin, async (req, res) => {
  try {
    const result = await ChatMessage.deleteMany({ 
      sessionId: req.params.sessionId 
    });
    
    res.json({ 
      success: true, 
      message: 'Chat deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

