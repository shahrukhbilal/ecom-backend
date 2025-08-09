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
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("📦 Incoming Order Body:", req.body); // Debugging log

    const { cartItems, shippingInfo, paymentMethod, total, paymentStatus } = req.body;

    // ✅ Map items properly with productId
    const items = cartItems.map(item => ({
      productId: item.productId || item._id, // fallback to _id if productId missing
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // ✅ Validate required fields
    if (
      !shippingInfo?.fullName ||
      !shippingInfo?.email ||
      !shippingInfo?.phone ||
      !shippingInfo?.address ||
      !paymentMethod ||
      !items.length
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // ✅ Create new order
    const createdOrder = await Order.create({
      user: req.user._id, // from verifyToken
      fullName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      paymentMethod,
      paymentStatus,
      items,
      total,
    });

    console.log("✅ Order Saved:", createdOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ message: "Server error. Could not save order." });
  }
});

module.exports = router;
