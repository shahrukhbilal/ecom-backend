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
  console.log('server is runnig and register route is working')
  try {
    console.log('📥 Incoming Register Request Body:', req.body);

    const { name, email, password, role, secretKey } = req.body;

    console.log('🔍 Extracted Data:', { name, email, role, hasSecretKey: !!secretKey });

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    // ================= CHECK EXISTING USER =================
    const exists = await User.findOne({ email });

    if (exists) {
      console.log('⚠️ Email already exists:', email);
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    // ================= ADMIN CHECK =================
    const isAdmin = role === 'admin';

    console.log('🧠 Role Check:', { role, isAdmin });

    if (isAdmin) {
      console.log('🔐 Admin registration attempt detected');

      if (!process.env.ADMIN_SECRET_KEY) {
        console.error('🚨 ADMIN_SECRET_KEY is missing in .env');
        return res.status(500).json({
          message: 'Server misconfiguration: missing admin secret key',
        });
      }

      if (!secretKey) {
        console.log('❌ Secret key not provided');
        return res.status(401).json({
          message: 'Secret key required for admin',
        });
      }

      if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        console.log('❌ Invalid secret key:', secretKey);
        return res.status(401).json({
          message: 'Invalid admin secret key',
        });
      }

      console.log('✅ Admin validation passed');
    }

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    console.log('👤 User created:', user._id);

    // ================= TOKEN =================
    const token = generateToken(user);

    console.log('🔑 Token generated');

    // ================= RESPONSE =================
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error('💥 Registration Error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
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
