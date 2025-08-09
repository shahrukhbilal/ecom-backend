const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 🔐 Middleware to verify JWT token
// 🔐 Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Attach user to request
    req.user = user;

    // ✅ Agar admin hai to req.admin me attach karo
    if (user.isAdmin) {
      req.admin = {
        name: user.name,
        email: user.email,
        _id: user._id,
      };
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 🔐 Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) { // 🔹 yahan bhi isAdmin use karna hai
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { verifyToken, isAdmin };
