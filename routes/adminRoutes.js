const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../services/uploadService');

router.use(isAuthenticated, isAdmin);

// Dashboard
router.get('/', adminController.getAdminDashboard);

// Tours Management
const tourUploadFields = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

router.get('/tours', adminController.getAdminTours);
router.get('/tours/create', adminController.getAdminCreateTour);
router.post('/tours/create', tourUploadFields, adminController.postAdminCreateTour);
router.get('/tours/:id/edit', adminController.getAdminEditTour);
router.post('/tours/:id/edit', tourUploadFields, adminController.postAdminEditTour);
router.post('/tours/:id/delete', adminController.postAdminDeleteTour);
router.post('/tours/images/:imageId/delete', adminController.postAdminDeleteTourImage);

// Destinations Management
router.get('/destinations', adminController.getAdminDestinations);
router.get('/destinations/create', adminController.getAdminCreateDestination);
router.post('/destinations/create', upload.single('banner'), adminController.postAdminCreateDestination);
router.post('/destinations/quick-create', adminController.postAdminQuickCreateDestination);
router.get('/destinations/:id/edit', adminController.getAdminEditDestination);
router.post('/destinations/:id/edit', upload.single('banner'), adminController.postAdminEditDestination);
router.post('/destinations/:id/delete', adminController.postAdminDeleteDestination);

// Categories Management
router.get('/categories', adminController.getAdminCategories);
router.post('/categories/create', upload.single('image'), adminController.postAdminCreateCategory);
router.post('/categories/quick-create', adminController.postAdminQuickCreateCategory);
router.get('/categories/:id/edit', adminController.getAdminEditCategory);
router.post('/categories/:id/edit', upload.single('image'), adminController.postAdminEditCategory);
router.post('/categories/:id/delete', adminController.postAdminDeleteCategory);

// Bookings Management
router.get('/bookings', adminController.getAdminBookings);
router.post('/bookings/:id/status', adminController.postAdminUpdateBookingStatus);

// Customers Management
router.get('/customers', adminController.getAdminCustomers);

// Reviews Management
router.get('/reviews', adminController.getAdminReviews);
router.post('/reviews/:id/approve', adminController.postAdminApproveReview);

// Coupons Management
router.get('/coupons', adminController.getAdminCoupons);
router.post('/coupons/create', adminController.postAdminCreateCoupon);

// Messages & Newsletter
router.get('/contacts', adminController.getAdminContacts);
router.get('/newsletters', adminController.getAdminNewsletters);

// Settings
router.get('/settings', adminController.getAdminSettings);

// Blog Posts Management
router.get('/blogs', adminController.getAdminBlogs);
router.get('/blogs/create', adminController.getAdminCreateBlog);
router.post('/blogs/create', upload.single('featuredImage'), adminController.postAdminCreateBlog);
router.get('/blogs/:id/edit', adminController.getAdminEditBlog);
router.post('/blogs/:id/edit', upload.single('featuredImage'), adminController.postAdminEditBlog);
router.post('/blogs/:id/delete', adminController.postAdminDeleteBlog);

module.exports = router;
