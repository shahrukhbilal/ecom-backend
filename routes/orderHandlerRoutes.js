// backend/routes/orderHandlerRoutes.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/orderModel');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const isValidObjectId = id =>
  mongoose.Types.ObjectId.isValid(id) &&
  String(new mongoose.Types.ObjectId(id)) === id;

// 🔐 🗓️ Fetch orders only for the logged-in user
router.get('/my-orders', verifyToken, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});


// 🛡️ 📦 Fetch all orders (for admin/testing use only)
router.get('/admin-orders',verifyToken, isAdmin, async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all/admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch admin orders' });
  }
});

// 🛒 Create an order (authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      fullName, email, phone,
      address, city, zip,
      paymentMethod, items, total
    } = req.body;

    if (
      !fullName || !email || !phone ||
      !address || !city || !zip ||
      !paymentMethod ||
      !Array.isArray(items) || items.length === 0 ||
      total == null
    ) {
      return res.status(400).json({ message: 'Missing required order or address details.' });
    }

    for (const item of items) {
      if (
        !item.productId ||
        !isValidObjectId(item.productId) ||
        typeof item.name !== 'string' ||
        typeof item.quantity !== 'number' ||
        typeof item.price !== 'number'
      ) {
        return res.status(400).json({ message: `Invalid item detected: ${JSON.stringify(item)}` });
      }
    }

    const formattedItems = items.map(item => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const newOrder = new Order({
      user: req.user.id, // 🔐 Link order to user
      fullName,
      email,
      phone,
      address,
      city,
      zip,
      paymentMethod,
      items: formattedItems,
      total
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Server error – could not save order.' });
  }
});

module.exports = router;
