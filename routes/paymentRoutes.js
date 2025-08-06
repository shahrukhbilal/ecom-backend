const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const {verifyToken} = require('../middleware/authMiddleware'); // Make sure this adds req.user.userId

// Route: Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe accepts amounts in cents
      currency: 'myr', // Malaysia Ringgit
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: 'Payment intent failed' });
  }
});

// Route: Save Order After Payment
router.post('/save-order-payment', verifyToken, async (req, res) => {
  try {
    const { cartItems, totalAmount, paymentStatus, paymentId } = req.body;

    const newOrder = new Order({
      user: req.user.userId, // ✅ Set user from JWT
      cartItems,
      totalAmount,
      paymentStatus,
      paymentId,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Save Order Error:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

module.exports = router;
