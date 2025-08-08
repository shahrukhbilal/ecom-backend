const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middleware/authMiddleware');
const { saveOrderAndPayment } = require('../controllers/paymentController');

// ✅ Route: Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe accepts cents
      currency: 'myr', // Malaysia Ringgit
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: 'Payment intent failed' });
  }
});

// ✅ Route: Save Order & Payment (after payment success)
router.post('/save-order-payment', verifyToken, saveOrderAndPayment);

module.exports = router;
