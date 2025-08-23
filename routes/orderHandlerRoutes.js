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
// 🛒 Create an order (authenticated)
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("📦 Incoming Order Body:", req.body);

    const { cartItems, shippingInfo, paymentMethod, total, paymentStatus } = req.body;

    // ✅ Validate required fields
    if (
      !shippingInfo?.name ||
      !shippingInfo?.email ||
      !shippingInfo?.phone ||
      !shippingInfo?.address ||
      !paymentMethod ||
      !cartItems.length
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    // ✅ Create new order matching model schema
    const createdOrder = await Order.create({
      user: req.user._id,
      cartItems: cartItems.map(item => ({
        productId: item.productId || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingInfo: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
      },
      total,
      paymentMethod,
      paymentStatus,
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
