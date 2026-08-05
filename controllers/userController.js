const { User, Booking, Tour, Wishlist, Payment, Destination } = require('../models');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const bcrypt = require('bcryptjs');

/**
 * User Dashboard Main Overview
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Tour, as: 'tour' }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const totalBookingsCount = await Booking.count({ where: { userId } });
    const wishlistCount = await Wishlist.count({ where: { userId } });

    res.render('pages/dashboard/index', {
      title: 'User Dashboard | WanderLust Tours',
      metaTitle: 'User Dashboard Overview',
      metaDescription: 'Manage your tour bookings, profile settings, and saved wishlist.',
      user: req.user,
      bookings,
      totalBookingsCount,
      wishlistCount,
      formatCurrency,
      formatDate,
      welcome: req.query.welcome || null,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User Booking History
 */
const getBookingHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Tour, as: 'tour' },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/dashboard/bookings', {
      title: 'My Booking History | WanderLust Tours',
      metaTitle: 'My Tour Bookings',
      metaDescription: 'View your current and past tour reservations.',
      bookings,
      formatCurrency,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Wishlist Page
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Tour,
          as: 'tour',
          include: [{ model: Destination, as: 'destination' }]
        }
      ]
    });

    res.render('pages/dashboard/wishlist', {
      title: 'My Saved Wishlist | WanderLust Tours',
      metaTitle: 'Saved Favorite Tours',
      metaDescription: 'View your saved favorite travel packages.',
      wishlistItems,
      formatCurrency,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle Wishlist API
 */
const toggleWishlist = async (req, res) => {
  const { tourId } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Wishlist.findOne({ where: { userId, tourId } });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, added: false, message: 'Removed from wishlist.' });
    } else {
      await Wishlist.create({ userId, tourId });
      return res.json({ success: true, added: true, message: 'Added to wishlist!' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update wishlist.' });
  }
};

/**
 * Profile Edit Page
 */
const getProfile = (req, res) => {
  res.render('pages/dashboard/profile', {
    title: 'Edit Profile | WanderLust Tours',
    metaTitle: 'Profile Settings',
    metaDescription: 'Update your account profile and password.',
    user: req.user,
    success: req.query.success || null,
    error: req.query.error || null
  });
};

/**
 * Update Profile Action
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { name, phone, address, bio } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    if (req.file) {
      user.avatar = '/uploads/' + req.file.filename;
    }

    await user.save();

    res.redirect('/dashboard/profile?success=' + encodeURIComponent('Profile updated successfully!'));
  } catch (err) {
    next(err);
  }
};

/**
 * Change Password Action
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (newPassword !== confirmNewPassword) {
      return res.redirect('/dashboard/profile?error=' + encodeURIComponent('New passwords do not match.'));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.redirect('/dashboard/profile?error=' + encodeURIComponent('Current password is incorrect.'));
    }

    user.password = newPassword;
    await user.save();

    res.redirect('/dashboard/profile?success=' + encodeURIComponent('Password updated successfully!'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getBookingHistory,
  getWishlist,
  toggleWishlist,
  getProfile,
  updateProfile,
  changePassword
};
