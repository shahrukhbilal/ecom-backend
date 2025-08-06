const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');


const {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  deleteUser,
  updateOrderStatus,
  getDashboardStats,
  createProduct,
  createPaymentIntent,
  deleteProduct,
} = require('../controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

// ✅ USERS ROUTES
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// ✅ PRODUCTS ROUTES
router.get('/products', verifyToken, isAdmin, getAllProducts);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);


// ✅ ORDERS ROUTES
router.get('/orders', verifyToken, isAdmin, getAllOrders);
router.get('/orders/:id', verifyToken, isAdmin, getSingleOrder);
router.delete('/orders/:id', verifyToken, isAdmin, deleteOrder);
router.put('/orders/:id/status', verifyToken, isAdmin, updateOrderStatus);

// ✅ DASHBOARD ROUTE
router.get('/stats', verifyToken, isAdmin, getDashboardStats);
//  ✅ createPayment 

// Top:

// Inside router:
router.post('/products', verifyToken, isAdmin, upload.single('image'), createProduct);

module.exports = router;
