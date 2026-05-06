const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductBySlug, searchProducts, getProductsByCategory } = require('../controllers/productController');
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), createProduct);        // POST /api/products


router.get('/category/:slug', getProductsByCategory); // GET /api/products/category/electronics
router.get('/', getAllProducts);         // GET /api/products
router.get('/search', searchProducts);      // GET /api/products/search?q=abc
router.get('/search/:q', searchProducts);   // GET /api/products/search/abc
// router.get('/category/:slug', getProductsByCategory); // GET /api/products/category/electronics
module.exports = router;
