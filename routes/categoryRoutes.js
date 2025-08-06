const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');

router.get('/', getCategories);      // Public
router.post('/', createCategory);    // Admin later

module.exports = router;
