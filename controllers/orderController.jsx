// routes/orderController.js
const Order = require('../models/orderModel');

// ✅ GET orders for the logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }); // ✅ Filter by logged-in user
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};

// ✅ Create a new order linked to the logged-in user
const createOrder = async (req, res) => {
  try {
    const {
      fullName, email, phone,
      address, city, zip,
      paymentMethod, items, total
    } = req.body;

    console.log("✅ Incoming Order Data:", req.body);

    const newOrder = await Order.create({
      user: req.user._id, // ✅ Attach logged-in user ID
      fullName, email, phone,
      address, city, zip,
      paymentMethod, items, total
    });

    res.status(201).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// ✅ Export both handlers
module.exports = {
  createOrder,
  getMyOrders,
};
