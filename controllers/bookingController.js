const { Tour, TourSchedule, Booking, BookingDetail, Payment, Coupon, User } = require('../models');
const { createPaymentIntent } = require('../services/stripeService');
const { sendBookingConfirmationEmail } = require('../services/emailService');
const { formatCurrency, formatDate } = require('../helpers/formatters');

/**
 * Render Checkout Page
 */
const getCheckout = async (req, res, next) => {
  try {
    const { tourId, scheduleId, departureDate, guests } = req.query;

    if (!tourId) {
      return res.redirect('/tours?error=' + encodeURIComponent('Please select a tour to book.'));
    }

    const tour = await Tour.findByPk(tourId);
    if (!tour) {
      return res.redirect('/tours?error=' + encodeURIComponent('Selected tour could not be found.'));
    }

    const guestCount = parseInt(guests || '1', 10);
    const selectedDate = departureDate || new Date().toISOString().split('T')[0];

    const basePrice = parseFloat(tour.discountPrice || tour.price);
    const totalAmount = basePrice * guestCount;

    res.render('pages/checkout', {
      title: 'Checkout & Payment | WanderLust Tours',
      metaTitle: 'Secure Booking Checkout - WanderLust',
      metaDescription: 'Complete your tour booking with secure instant Stripe payment.',
      tour,
      scheduleId: scheduleId || null,
      departureDate: selectedDate,
      guestCount,
      totalAmount,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sample',
      formatCurrency,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Apply Coupon Code API
 */
const applyCoupon = async (req, res) => {
  const { code, totalAmount } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
  }

  try {
    const coupon = await Coupon.findOne({ where: { code: code.trim().toUpperCase(), isActive: true } });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promotional coupon code.' });
    }

    const currentDate = new Date().toISOString().split('T')[0];
    if (coupon.expiresAt < currentDate) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    const subtotal = parseFloat(totalAmount || 0);
    if (subtotal < parseFloat(coupon.minBookingAmount)) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum booking subtotal of ${formatCurrency(coupon.minBookingAmount)}.`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }

    const newTotal = Math.max(0, subtotal - discount);

    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      couponCode: coupon.code,
      discountAmount: discount,
      finalAmount: newTotal
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error processing coupon.' });
  }
};

/**
 * Process Booking Submission
 */
const processBooking = async (req, res, next) => {
  try {
    const { tourId, scheduleId, departureDate, guestCount, contactName, contactEmail, contactPhone, specialRequests, couponCode, paymentMethod } = req.body;

    const tour = await Tour.findByPk(tourId);
    if (!tour) {
      return res.redirect('/tours?error=' + encodeURIComponent('Tour not found.'));
    }

    const guests = parseInt(guestCount || '1', 10);
    const unitPrice = parseFloat(tour.discountPrice || tour.price);
    let subtotal = unitPrice * guests;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode.trim().toUpperCase(), isActive: true } });
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * parseFloat(coupon.discountValue)) / 100;
        } else {
          discountAmount = parseFloat(coupon.discountValue);
        }
        coupon.timesUsed += 1;
        await coupon.save();
      }
    }

    const finalAmount = Math.max(0, subtotal - discountAmount);
    const bookingCode = 'WL-' + Math.floor(100000 + Math.random() * 900000);

    // Create Payment Intent via Stripe Service
    const paymentIntent = await createPaymentIntent(finalAmount, 'usd', { bookingCode, tourId: tour.id });

    // Determine User ID (Logged-in user, existing user by email, or null for guests)
    let userId = req.user ? req.user.id : null;
    if (!userId && contactEmail) {
      const existingUser = await User.findOne({ where: { email: contactEmail.trim().toLowerCase() } });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // Save Booking in Database
    const booking = await Booking.create({
      bookingCode,
      userId,
      tourId: tour.id,
      scheduleId: scheduleId ? parseInt(scheduleId, 10) : null,
      departureDate,
      guestCount: guests,
      contactName,
      contactEmail,
      contactPhone,
      totalAmount: subtotal,
      discountAmount,
      finalAmount,
      couponCode: couponCode || null,
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'stripe',
      bookingStatus: 'confirmed',
      specialRequests
    });

    // Create Guest Details
    await BookingDetail.create({
      bookingId: booking.id,
      guestName: contactName,
      guestEmail: contactEmail,
      guestPhone: contactPhone
    });

    // Save Payment record
    await Payment.create({
      bookingId: booking.id,
      transactionId: paymentIntent.id,
      paymentMethod: paymentMethod || 'stripe',
      amount: finalAmount,
      currency: 'usd',
      status: 'succeeded'
    });

    // Send Email Confirmation
    await sendBookingConfirmationEmail(contactEmail, booking, tour);

    return res.redirect(`/booking-success?code=${booking.bookingCode}`);
  } catch (err) {
    console.error('Booking Error:', err);
    return res.redirect('/booking-failed?error=' + encodeURIComponent(err.message || 'Payment processing failed.'));
  }
};

/**
 * Booking Success Page
 */
const getBookingSuccess = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect('/');

    const booking = await Booking.findOne({
      where: { bookingCode: code },
      include: [
        { model: Tour, as: 'tour' },
        { model: Payment, as: 'payment' }
      ]
    });

    if (!booking) return res.redirect('/');

    res.render('pages/booking-success', {
      title: 'Booking Confirmed! | WanderLust Tours',
      metaTitle: 'Booking Confirmation',
      metaDescription: 'Your tour booking has been confirmed.',
      booking,
      formatCurrency,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Booking Failed Page
 */
const getBookingFailed = (req, res) => {
  res.render('pages/booking-failed', {
    title: 'Booking Failed | WanderLust Tours',
    metaTitle: 'Payment Issue',
    metaDescription: 'There was an issue processing your booking payment.',
    error: req.query.error || 'Your payment transaction could not be authorized.'
  });
};

/**
 * Cancel Booking API
 */
const cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findOne({
      where: { id, userId: req.user.id }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    return res.json({ success: true, message: 'Your booking has been cancelled and refund processed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};

module.exports = {
  getCheckout,
  applyCoupon,
  processBooking,
  getBookingSuccess,
  getBookingFailed,
  cancelBooking
};
