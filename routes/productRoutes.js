const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductBySlug, searchProducts } = require('../controllers/productController');
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), createProduct);        // POST /api/products


router.get('/', getAllProducts);         // GET /api/products
router.get('/slug/:slug', getProductBySlug); // ✅ use /slug/:slug instead of /:slug
router.get('/search', searchProducts);      // GET /api/products/search?q=abc
router.get('/search/:q', searchProducts);   // GET /api/products/search/abc
module.exports = router;
