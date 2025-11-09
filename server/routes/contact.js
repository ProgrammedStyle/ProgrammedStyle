const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactNotification, sendContactAutoReply } = require('../services/emailService');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty().trim().escape(),
  body('message').notEmpty().trim().escape(),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, phone, subject, message } = req.body;
    
    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contact.save();
    
    // Send emails (don't wait for completion)
    Promise.all([
      sendContactNotification(contact),
      sendContactAutoReply(contact)
    ]).catch(error => {
      console.error('Email sending error:', error);
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/contact/:id/status
 * @desc    Update contact status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

