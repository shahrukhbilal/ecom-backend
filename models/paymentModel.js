// backend/models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: String,
  transactionId: String, // Stripe's paymentIntent.id
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
