const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// ===============================
// @route   POST /api/auth/register
// ===============================
// ===============================
// @route   POST /api/auth/register
// ===============================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, secretKey } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // If user is trying to register as admin, validate secret key
    if (role === 'admin') {
      if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: 'Invalid or missing admin secret key' });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.role === 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Response
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: true,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


// ===============================
// @route   POST /api/auth/login
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const u = await User.findOne({ email });
    if (!u || !(await u.compare(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: u._id,
        email: u.email,
        isAdmin: u.role === 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Response
    res.json({
      token,
      user: {
        name: u.name,
        email: u.email,
        isAdmin: u.role === 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
