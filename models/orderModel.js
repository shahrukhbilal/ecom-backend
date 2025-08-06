const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  shippingInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  total: Number,
  paymentMethod: String,
  paymentStatus: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
