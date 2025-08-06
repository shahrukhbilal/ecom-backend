const HeroSlide = require('../models/heroSliderModel');

// GET /api/heroslides
const getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load hero slides' });
  }
};

// POST /api/heroslides (Admin only)
const createSlide = async (req, res) => {
  try {
    const newSlide = await HeroSlide.create(req.body);
    res.status(201).json(newSlide);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create slide' });
  }
};

// DELETE /api/heroslides/:id (Admin only)
const deleteSlide = async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete slide' });
  }
};

module.exports = { getAllSlides, createSlide, deleteSlide };
