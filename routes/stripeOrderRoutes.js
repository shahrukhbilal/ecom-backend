// backend/routes/stripeOrderRoutes.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/orderModel');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/stripe-order
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      cartItems,
      shippingInfo,
      total,
      paymentMethod,
      paymentStatus,
    } = req.body;

    // 1. Check if payment actually succeeded
    if (paymentStatus !== 'succeeded') {
      return res
        .status(400)
        .json({ message: 'Payment not successful. Order not saved.' });
    }

    // 2. Validate required fields
    if (
      !shippingInfo?.fullName ||
      !shippingInfo?.email ||
      !shippingInfo?.phone ||
      !shippingInfo?.address ||
      !shippingInfo?.city ||
      !shippingInfo?.zip ||
      !paymentMethod ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0 ||
      total == null
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required order fields.' });
    }

    // 3. Format cartItems to match order schema
    const formattedItems = cartItems.map((item) => ({
      productId: item._id || item.productId, // handle both cases
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // 4. Create and save new Order
    const newOrder = new Order({
      user: req.user.userId, // from verifyToken middleware
      fullName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      city: shippingInfo.city,
      zip: shippingInfo.zip,
      paymentMethod,
      items: formattedItems,
      total,
      status: 'paid', // since payment is successful
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Stripe order saved!', order: savedOrder });
  } catch (err) {
    console.error('Stripe Order Save Error:', err);
    res.status(500).json({ message: 'Server error while saving Stripe order.' });
  }
});

module.exports = router;
