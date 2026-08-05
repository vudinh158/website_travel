const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../services/uploadService');

router.use(isAuthenticated);

router.get('/dashboard', userController.getDashboard);
router.get('/dashboard/bookings', userController.getBookingHistory);
router.post('/dashboard/bookings/:id/cancel', bookingController.cancelBooking);

router.get('/dashboard/wishlist', userController.getWishlist);
router.post('/dashboard/wishlist/toggle', userController.toggleWishlist);

router.get('/dashboard/profile', userController.getProfile);
router.post('/dashboard/profile/update', upload.single('avatar'), userController.updateProfile);
router.post('/dashboard/profile/change-password', userController.changePassword);

module.exports = router;
