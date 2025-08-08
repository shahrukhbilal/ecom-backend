const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');

const saveOrderAndPayment = async (req, res) => {
  try {
    const {
      cartItems,
      shippingInfo, // { name, email, phone, address }
      total,
      paymentMethod,
      paymentStatus,
      paymentId // Stripe paymentIntentId
    } = req.body;

    // ✅ Save Order in correct schema format
    const newOrder = await Order.create({
      user: req.user.userId, // From verifyToken middleware
      cartItems,
      shippingInfo,
      total,
      paymentMethod,
      paymentStatus
    });

    // ✅ Save Payment separately
    await Payment.create({
      order: newOrder._id,
      user: req.user.userId,
      amount: total,
      status: paymentStatus,
      transactionId: paymentId,
      paymentMethod
    });

    res.status(201).json({ message: 'Order and payment saved!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error saving order/payment:', error);
    res.status(500).json({ message: 'Failed to save order/payment' });
  }
};

module.exports = { saveOrderAndPayment };
