const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const tourController = require('../controllers/tourController');
const destinationController = require('../controllers/destinationController');
const blogController = require('../controllers/blogController');
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Home & Public Pages
router.get('/', publicController.getHome);
router.get('/about', publicController.getAbout);
router.get('/contact', publicController.getContact);
router.post('/contact', publicController.postContact);
router.get('/faq', publicController.getFAQ);
router.get('/privacy', publicController.getPrivacy);
router.get('/terms', publicController.getTerms);

// Tours Pages
router.get('/tours', tourController.getTours);
router.get('/tours/category/:slug', tourController.getCategorySilo);
router.get('/tours/:slug', tourController.getTourDetail);

// Destinations Pages
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/:slug', destinationController.getDestinationDetail);

// Blog Pages
router.get('/blog', blogController.getBlogs);
router.get('/blog/:slug', blogController.getBlogDetail);

// Booking Flow Pages (Supports both Guest Checkout & Logged-in Users)
router.get('/checkout', bookingController.getCheckout);
router.post('/checkout/process', bookingController.processBooking);
router.get('/booking-success', bookingController.getBookingSuccess);
router.get('/booking-failed', bookingController.getBookingFailed);

module.exports = router;
