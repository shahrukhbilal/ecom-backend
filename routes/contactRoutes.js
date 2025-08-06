// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/contactModel'); // ✅ MongoDB model
require('dotenv').config(); // ✅ Load env variables

// ✅ Configure transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail
    pass: process.env.EMAIL_PASS,  // App password (not real Gmail password)
  },
});
// ✅ GET /api/contact - Fetch all messages

// ✅ POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    
    router.get('/', async (req, res) => {
      try {
        const messages = await Contact.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error. Could not fetch messages.' });
      }
    });

    // ✅ Save message to MongoDB
    const savedContact = await Contact.create({ name, email, message });

    // ✅ Send email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: '📬 New Contact Message Received',
      text: `You received a new message:\n\nFrom: ${name} (${email})\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Message sent & saved successfully', data: savedContact });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ message: 'Server error. Could not send message.' });
  }
});

module.exports = router;
