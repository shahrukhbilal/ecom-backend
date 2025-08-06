const express = require('express');
const router = express.Router();
const {
  getAllSlides,
  createSlide,
  deleteSlide,
} = require('../controllers/heroSliderController');

// Public
router.get('/', getAllSlides);

// Admin only routes (protected in future)
router.post('/', createSlide);
router.delete('/:id', deleteSlide);

module.exports = router;
