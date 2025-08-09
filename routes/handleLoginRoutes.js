const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Helper function to create JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin, // consistent boolean
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// ===============================
// @route   POST /api/auth/register
// ===============================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, secretKey } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Handle admin registration
    let isAdmin = false;
    if (role === 'admin') {
      if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: 'Invalid or missing admin secret key' });
      }
      isAdmin = true;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
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

    // Find user
    const u = await User.findOne({ email });
    if (!u || !(await u.compare(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(u);

    // Send response
    res.json({
      token,
      user: {
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin, // direct boolean
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
