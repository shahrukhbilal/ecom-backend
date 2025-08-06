const express = require('express');
const router = express.Router();
const FeaturedCategory = require('../models/featuredCategoryModel');

const {
  createFeaturedCategory,
  getFeaturedCategories,
} = require('../controllers/featuredCategoryController');

// Just keep test route for safety
router.get('/test', (req, res) => {
  res.send('Test route working ✅');
});
// Optional test route
router.get('/test-categories', async (req, res) => {
  const cats = await FeaturedCategory.find();
  res.json(cats);
});


// Create featured category
router.post('/', createFeaturedCategory);

// Get all featured categories
router.get('/', getFeaturedCategories);

module.exports = router;
