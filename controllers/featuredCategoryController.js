const FeaturedCategory = require('../models/featuredCategoryModel');

const createFeaturedCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const category = await FeaturedCategory.create({ name, slug, image });
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Featured category creation error:', error);
    res.status(400).json({ message: 'Error creating category' });
  }
};

const getFeaturedCategories = async (req, res) => {
  try {
    console.log("📦 Fetching featured categories...");
    const categories = await FeaturedCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('❌ Error fetching featured categories:', error);
    res.status(500).json({ message: 'Failed to fetch featured categories' });
  }
};

module.exports = { createFeaturedCategory, getFeaturedCategories };
