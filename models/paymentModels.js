const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model('Payment', paymentSchema);
