const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

const { sendShipmentEmail } = require('../utils/mailer'); // ✅ Ensure correct path

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    // ✅ Send shipment email only if status is 'Shipped' and email exists
    if (status === 'Shipped' && order.user?.email) {
      try {
        const info = await sendShipmentEmail(order.user.email, order.user.name, order._id);
        console.log("✅ Shipment email sent:", info.response);
      } catch (error) {
        console.error("❌ Email sending failed:", error.message);
      }
    }

    res.status(200).json({ msg: 'Status updated successfully' });
  } catch (err) {
    console.error("❌ Order status update error:", err.message);
    res.status(500).json({ msg: 'Error updating order status', error: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};


// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users', error: err.message });
  }
};

// ✅ Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user', error: err.message });
  }
};

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching products', error: err.message });
  }
};

// ✅ Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching orders', error: err.message });
  }
};

// ✅ Get single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Delete an order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Update order status

// ✅ Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching dashboard stats', error: err.message });
  }
};
const createProduct = async (req, res) => {
  try {
    // 1. Destructure form data from the request body
    const { name, slug, description, price, category, stock } = req.body;

    // 2. Validate required fields
    if (!name || !slug || !description || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 3. Check if file is present
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // 4. Upload image to Cloudinary
    const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
    });

    // 5. Create a new product in DB
    const newProduct = new Product({
      name,
      slug,
      description,
      image: cloudUpload.secure_url,  // ✅ Cloudinary image URL
      price,
      category,
      stock,
    });

    await newProduct.save();

    // 6. Send success response
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  deleteUser,
  updateOrderStatus,
  getDashboardStats,
  createProduct,
  deleteProduct
};
