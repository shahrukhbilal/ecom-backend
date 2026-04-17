const express = require('express');
const router = express.Router();
const { getCategories, createCategory, getCategoryBySlug } = require('../controllers/categoryController');

router.get('/', getCategories); 
router.get('slug/:slug', getCategoryBySlug); // Public
router.post('/', createCategory);    // Admin later

module.exports = router;
