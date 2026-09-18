const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');
const tourController = require('../controllers/tourController');
const destinationController = require('../controllers/destinationController');
const inspirationController = require('../controllers/inspirationController');
const themeController = require('../controllers/themeController');
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// 1. Home
router.get('/', publicController.getHome);

// 2. Destinations (Vietnam Hub & Individual Destination Pages)
router.get('/vietnam', destinationController.getDestinations);
router.get('/vietnam/:slug', destinationController.getDestinationDetail);
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/:slug', destinationController.getDestinationDetail);

// 3. Tours (Filterable Hub & Single Tour Pages with Format Toggle)
router.get('/tours', tourController.getTours);
router.get('/tours/category/:slug', tourController.getCategorySilo);
router.get('/tours/:slug', tourController.getTourDetail);

// 4. Itineraries (Editorial Trips grouped by duration)
router.get('/trips', inspirationController.getTrips);
router.get('/trips/:slug', inspirationController.getTripDetail);

// 5. Travel Guides
router.get('/guides', inspirationController.getGuides);
router.get('/guides/:slug', inspirationController.getGuideDetail);

// 6. Signature Experiences
router.get('/experiences', inspirationController.getExperiences);
router.get('/experiences/:slug', inspirationController.getExperienceDetail);

// 7. Customer Stories
router.get('/customer-stories', inspirationController.getCustomerStories);
router.get('/customer-stories/:slug', inspirationController.getCustomerStoryDetail);

// 8. Trip Reviews
router.get('/trip-reviews', inspirationController.getTripReviews);

// 9. Themes Hub
router.get('/themes', themeController.getThemes);

// 10. About & Trust Pages (Sitemap Section 11)
router.get('/about-us', publicController.getAbout);
router.get('/about', publicController.getAbout);
router.get('/how-it-works', publicController.getHowItWorks);
router.get('/meet-the-team', publicController.getMeetTheTeam);
router.get('/responsible-travel', publicController.getResponsibleTravel);
router.get('/loyalty-program', publicController.getLoyaltyProgram);

// 11. Contact & Enquiry Flow (Sitemap Section 13)
router.get('/contact', publicController.getContact);
router.post('/contact', publicController.postContact);
router.post('/enquiry', publicController.postEnquiry);
router.get('/thank-you', publicController.getThankYou);

// 12. Legal & Utility (Sitemap Section 12)
router.get('/faq', publicController.getFAQ);
router.get('/terms-conditions', publicController.getTerms);
router.get('/terms', publicController.getTerms);
router.get('/privacy-policy', publicController.getPrivacy);
router.get('/privacy', publicController.getPrivacy);

// 13. Newsletter
router.post('/newsletter/subscribe', publicController.subscribeNewsletter);

// 14. Booking Flow Pages (Retains Stripe and Direct Checkout)
router.get('/checkout', bookingController.getCheckout);
router.post('/checkout/process', bookingController.processBooking);
router.get('/booking-success', bookingController.getBookingSuccess);
router.get('/booking-failed', bookingController.getBookingFailed);

// 15. Flat Themes (Sitemap Section 6 - e.g. /honeymoon, /family, /adventure, /vietnam-tours-from-usa)
// Placed at the bottom so it only matches valid theme slugs without overriding existing endpoints
router.get('/:themeSlug', themeController.getThemeBySlug);

module.exports = router;
