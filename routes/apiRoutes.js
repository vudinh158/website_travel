const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const bookingController = require('../controllers/bookingController');
const userController = require('../controllers/userController');
const { Tour, Destination, Category, Review } = require('../models');
const { apiLimiter } = require('../middleware/rateLimiter');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(apiLimiter);

// Search & Autocomplete
router.get('/v1/search/autocomplete', publicController.searchAutocomplete);

// Newsletter Subscription
router.post('/v1/newsletter/subscribe', publicController.postSubscribeNewsletter);

// Apply Coupon Code
router.post('/v1/coupons/apply', bookingController.applyCoupon);

// Wishlist Toggle
router.post('/v1/wishlist/toggle', isAuthenticated, userController.toggleWishlist);

// Standard REST APIs
router.get('/v1/tours', async (req, res) => {
  try {
    const tours = await Tour.findAll({ where: { status: 'active' }, include: ['destination', 'category'] });
    res.json({ success: true, count: tours.length, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/v1/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id, { include: ['destination', 'category', 'reviews'] });
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/v1/destinations', async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
