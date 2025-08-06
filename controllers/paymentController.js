const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');

const saveOrderAndPayment = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      zip,
      items,
      total,
      paymentMethod,
      paymentIntentId, // From Stripe
      paymentStatus,
    } = req.body;

    // Save the Order
    const newOrder = await Order.create({
      user: userId,
      fullName,
      email,
      phone,
      address,
      city,
      zip,
      items,
      total,
      paymentMethod,
      status: 'paid',
    });

    // Save Payment
    await Payment.create({
      order: newOrder._id,
      user: userId,
      amount: total,
      status: paymentStatus,
      transactionId: paymentIntentId,
      paymentMethod,
    });

    res.status(201).json({ message: 'Order and payment saved!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error saving order/payment:', error);
    res.status(500).json({ message: 'Failed to save order/payment' });
  }
};

module.exports = { saveOrderAndPayment };
