const { Tour, Destination, Category, Booking, User, Review, Blog, Coupon, Contact, NewsletterSubscriber, Payment, Setting, TourImage } = require('../models');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * Slugify helper function for clean, Vietnamese-accent-free SEO URLs
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Helper to convert comma or newline-separated text into a JSON array string
 */
function parseListInput(input) {
  if (!input) return null;
  if (Array.isArray(input)) return JSON.stringify(input);
  const items = input
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
  return items.length > 0 ? JSON.stringify(items) : null;
}

/**
 * Helper to parse itinerary into JSON array [{ day: 1, title: '...', description: '...' }]
 */
function parseItineraryInput(input) {
  if (!input) return null;
  
  // If already array
  if (Array.isArray(input)) {
    const valid = input.filter(item => item && (item.title || item.description)).map((item, idx) => ({
      day: idx + 1,
      title: item.title ? item.title.trim() : `Day ${idx + 1}`,
      description: item.description ? item.description.trim() : ''
    }));
    return valid.length > 0 ? JSON.stringify(valid) : null;
  }
  
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(item => item && (item.title || item.description)).map((item, idx) => ({
          day: idx + 1,
          title: item.title ? item.title.trim() : `Day ${idx + 1}`,
          description: item.description ? item.description.trim() : ''
        }));
        return valid.length > 0 ? JSON.stringify(valid) : null;
      }
    } catch(e) {}
    
    // Fallback if plain text multiline format
    const lines = trimmed.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const itinerary = [];
    lines.forEach((line, index) => {
      const parts = line.split('|');
      let titlePart = parts[0] ? parts[0].trim() : `Day ${index + 1}`;
      let descPart = parts[1] ? parts[1].trim() : '';

      const dayMatch = titlePart.match(/^Day\s*\d+\s*:\s*(.*)$/i);
      let title = dayMatch ? dayMatch[1] : titlePart;
      
      itinerary.push({
        day: index + 1,
        title: title || `Day ${index + 1} Activity`,
        description: descPart || titlePart
      });
    });
    return itinerary.length > 0 ? JSON.stringify(itinerary) : null;
  }

  return null;
}

/**
 * Admin Dashboard Overview & Analytics
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalRevenueResult = await Booking.sum('finalAmount', { where: { paymentStatus: 'paid' } });
    const totalRevenue = totalRevenueResult || 0;

    const totalBookings = await Booking.count();
    const totalTours = await Tour.count();
    const totalCustomers = await User.count({ where: { roleId: 2 } });

    // Recent orders
    const recentOrders = await Booking.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Tour, as: 'tour', attributes: ['name', 'slug'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // Popular Tours
    const popularTours = await Tour.findAll({
      order: [['totalReviews', 'DESC']],
      limit: 5
    });

    // Booking Status counts
    const confirmedCount = await Booking.count({ where: { bookingStatus: 'confirmed' } });
    const pendingCount = await Booking.count({ where: { bookingStatus: 'pending' } });
    const cancelledCount = await Booking.count({ where: { bookingStatus: 'cancelled' } });

    res.render('pages/admin/index', {
      title: 'Admin Dashboard | WanderLust',
      metaTitle: 'Admin Analytics & Management',
      metaDescription: 'Manage website tours, bookings, customers, and view revenue analytics.',
      totalRevenue,
      totalBookings,
      totalTours,
      totalCustomers,
      recentOrders,
      popularTours,
      statusCounts: { confirmedCount, pendingCount, cancelledCount },
      formatCurrency,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Tour Management - List Tours
 */
const getAdminTours = async (req, res, next) => {
  try {
    const tours = await Tour.findAll({
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/tours/index', {
      title: 'Manage Tours | Admin',
      metaTitle: 'Manage Tours',
      metaDescription: 'Manage tour packages',
      tours,
      formatCurrency,
      formatDate,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Render Create Tour Form
 */
const getAdminCreateTour = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll();
    const categories = await Category.findAll();

    res.render('pages/admin/tours/create', {
      title: 'Create New Tour | Admin',
      metaTitle: 'Add Tour',
      metaDescription: 'Add a new tour package',
      destinations,
      categories
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Post Create Tour
 */
const postAdminCreateTour = async (req, res, next) => {
  try {
    const {
      name,
      slug: customSlug,
      destinationId,
      categoryId,
      price,
      discountPrice,
      duration,
      shortDescription,
      fullDescription,
      departureLocation,
      meetingPoint,
      isFeatured,
      isBestSeller,
      highlights,
      includedServices,
      excludedServices,
      itinerary,
      googleMapsEmbed,
      cancellationPolicy
    } = req.body;

    const slug = customSlug ? slugify(customSlug) : slugify(name);

    let featuredImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    
    // Check uploaded files
    if (req.files && req.files['featuredImage'] && req.files['featuredImage'].length > 0) {
      featuredImage = '/uploads/' + req.files['featuredImage'][0].filename;
    } else if (req.file) {
      featuredImage = '/uploads/' + req.file.filename;
    }

    const newTour = await Tour.create({
      name,
      slug,
      destinationId: parseInt(destinationId, 10),
      categoryId: parseInt(categoryId, 10),
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      duration,
      shortDescription,
      fullDescription,
      departureLocation,
      meetingPoint,
      featuredImage,
      highlights: parseListInput(highlights),
      includedServices: parseListInput(includedServices),
      excludedServices: parseListInput(excludedServices),
      itinerary: parseItineraryInput(itinerary),
      googleMapsEmbed: googleMapsEmbed ? googleMapsEmbed.trim() : null,
      cancellationPolicy: cancellationPolicy ? cancellationPolicy.trim() : null,
      isFeatured: isFeatured === 'on',
      isBestSeller: isBestSeller === 'on',
      status: 'active'
    });

    // Save Gallery Images if uploaded
    if (req.files && req.files['galleryImages'] && req.files['galleryImages'].length > 0) {
      for (const file of req.files['galleryImages']) {
        await TourImage.create({
          tourId: newTour.id,
          imageUrl: '/uploads/' + file.filename,
          caption: name
        });
      }
    }

    res.redirect('/admin/tours?success=' + encodeURIComponent('New tour created successfully with full content details!'));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Tour Action
 */
const postAdminDeleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Tour.destroy({ where: { id } });
    res.redirect('/admin/tours?success=' + encodeURIComponent('Tour deleted successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Render Edit Tour Form
 */
const getAdminEditTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByPk(id, {
      include: [{ model: TourImage, as: 'images' }]
    });

    if (!tour) {
      return res.redirect('/admin/tours?error=' + encodeURIComponent('Tour package not found.'));
    }

    const destinations = await Destination.findAll();
    const categories = await Category.findAll();

    res.render('pages/admin/tours/edit', {
      title: 'Edit Tour Package | Admin',
      metaTitle: 'Edit Tour',
      metaDescription: 'Update tour package details',
      tour,
      destinations,
      categories,
      success: req.query.success || null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Post Edit Tour
 */
const postAdminEditTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug: customSlug,
      destinationId,
      categoryId,
      price,
      discountPrice,
      duration,
      shortDescription,
      fullDescription,
      departureLocation,
      meetingPoint,
      isFeatured,
      isBestSeller,
      status,
      highlights,
      includedServices,
      excludedServices,
      itinerary,
      googleMapsEmbed,
      cancellationPolicy
    } = req.body;

    const tour = await Tour.findByPk(id);
    if (!tour) {
      return res.redirect('/admin/tours?error=' + encodeURIComponent('Tour package not found.'));
    }

    tour.name = name;
    if (customSlug) {
      tour.slug = slugify(customSlug);
    } else if (name && name !== tour.name) {
      tour.slug = slugify(name);
    }

    tour.destinationId = parseInt(destinationId, 10);
    tour.categoryId = parseInt(categoryId, 10);
    tour.price = parseFloat(price);
    tour.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    tour.duration = duration;
    tour.shortDescription = shortDescription;
    tour.fullDescription = fullDescription;
    tour.departureLocation = departureLocation;
    tour.meetingPoint = meetingPoint;
    tour.highlights = parseListInput(highlights);
    tour.includedServices = parseListInput(includedServices);
    tour.excludedServices = parseListInput(excludedServices);
    tour.itinerary = parseItineraryInput(itinerary);
    tour.googleMapsEmbed = googleMapsEmbed ? googleMapsEmbed.trim() : null;
    tour.cancellationPolicy = cancellationPolicy ? cancellationPolicy.trim() : null;
    tour.isFeatured = isFeatured === 'on';
    tour.isBestSeller = isBestSeller === 'on';
    if (status) tour.status = status;

    if (req.files && req.files['featuredImage'] && req.files['featuredImage'].length > 0) {
      tour.featuredImage = '/uploads/' + req.files['featuredImage'][0].filename;
    } else if (req.file) {
      tour.featuredImage = '/uploads/' + req.file.filename;
    }

    await tour.save();

    // Add new gallery images if uploaded
    if (req.files && req.files['galleryImages'] && req.files['galleryImages'].length > 0) {
      for (const file of req.files['galleryImages']) {
        await TourImage.create({
          tourId: tour.id,
          imageUrl: '/uploads/' + file.filename,
          caption: tour.name
        });
      }
    }

    res.redirect(`/admin/tours/${tour.id}/edit?success=` + encodeURIComponent('Tour package updated successfully!'));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Individual Tour Gallery Image Action
 */
const postAdminDeleteTourImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const img = await TourImage.findByPk(imageId);
    if (img) {
      const tourId = img.tourId;
      await img.destroy();
      return res.redirect(`/admin/tours/${tourId}/edit?success=` + encodeURIComponent('Gallery photo deleted.'));
    }
    res.redirect('/admin/tours');
  } catch (err) {
    next(err);
  }
};

/**
 * Manage Bookings List
 */
const getAdminBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Tour, as: 'tour' },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/bookings/index', {
      title: 'Manage Bookings | Admin',
      metaTitle: 'Manage Bookings',
      metaDescription: 'Manage customer bookings',
      bookings,
      formatCurrency,
      formatDate,
      success: req.query.success || null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Booking Status
 */
const postAdminUpdateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const booking = await Booking.findByPk(id);
    if (booking) {
      booking.bookingStatus = bookingStatus;
      await booking.save();
    }

    res.redirect('/admin/bookings?success=' + encodeURIComponent('Booking status updated successfully!'));
  } catch (err) {
    next(err);
  }
};

/**
 * Manage Customers List
 */
const getAdminCustomers = async (req, res, next) => {
  try {
    const customers = await User.findAll({
      where: { roleId: 2 },
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/customers/index', {
      title: 'Customer Directory | Admin',
      metaTitle: 'Customer List',
      metaDescription: 'Manage registered users',
      customers,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Manage Reviews List & Approve Action
 */
const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Tour, as: 'tour' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/reviews/index', {
      title: 'Manage Reviews | Admin',
      metaTitle: 'Customer Reviews',
      metaDescription: 'Approve or reject customer reviews',
      reviews,
      formatDate,
      success: req.query.success || null
    });
  } catch (err) {
    next(err);
  }
};

const postAdminApproveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (review) {
      review.status = 'approved';
      await review.save();
    }
    res.redirect('/admin/reviews?success=' + encodeURIComponent('Review approved!'));
  } catch (err) {
    next(err);
  }
};

/* ==========================================================================
   Destination CRUD Management
   ========================================================================== */

const getAdminDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/destinations/index', {
      title: 'Manage Destinations | Admin',
      metaTitle: 'Destinations Management',
      metaDescription: 'Create, edit, and delete travel destinations',
      destinations,
      formatDate,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    next(err);
  }
};

const getAdminCreateDestination = (req, res) => {
  res.render('pages/admin/destinations/create', {
    title: 'Add New Destination | Admin',
    metaTitle: 'Add Destination',
    metaDescription: 'Add a new travel destination'
  });
};

const postAdminCreateDestination = async (req, res, next) => {
  try {
    const { name, slug: customSlug, country, description, travelGuide, attractions, isPopular, metaTitle, metaDescription } = req.body;
    const slug = customSlug ? slugify(customSlug) : slugify(name);

    let banner = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
    if (req.file) {
      banner = '/uploads/' + req.file.filename;
    }

    const attractionArray = attractions ? attractions.split(',').map(item => item.trim()).filter(Boolean) : [];

    await Destination.create({
      name,
      slug,
      country,
      description,
      banner,
      travelGuide,
      attractions: JSON.stringify(attractionArray),
      isPopular: isPopular === 'on',
      metaTitle,
      metaDescription
    });

    res.redirect('/admin/destinations?success=' + encodeURIComponent('Destination created successfully!'));
  } catch (err) {
    next(err);
  }
};

const getAdminEditDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);

    if (!destination) {
      return res.redirect('/admin/destinations?error=' + encodeURIComponent('Destination not found.'));
    }

    res.render('pages/admin/destinations/edit', {
      title: 'Edit Destination | Admin',
      metaTitle: 'Edit Destination',
      metaDescription: 'Update destination information',
      destination
    });
  } catch (err) {
    next(err);
  }
};

const postAdminEditDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug: customSlug, country, description, travelGuide, attractions, isPopular, metaTitle, metaDescription } = req.body;

    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.redirect('/admin/destinations?error=' + encodeURIComponent('Destination not found.'));
    }

    destination.name = name;
    if (customSlug) {
      destination.slug = slugify(customSlug);
    } else if (name && name !== destination.name) {
      destination.slug = slugify(name);
    }

    destination.country = country;
    destination.description = description;
    destination.travelGuide = travelGuide;
    if (attractions) {
      const attractionArray = attractions.split(',').map(item => item.trim()).filter(Boolean);
      destination.attractions = JSON.stringify(attractionArray);
    }
    destination.isPopular = isPopular === 'on';
    destination.metaTitle = metaTitle;
    destination.metaDescription = metaDescription;

    if (req.file) {
      destination.banner = '/uploads/' + req.file.filename;
    }

    await destination.save();
    res.redirect('/admin/destinations?success=' + encodeURIComponent('Destination updated successfully!'));
  } catch (err) {
    next(err);
  }
};

const postAdminDeleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tourCount = await Tour.count({ where: { destinationId: id } });

    if (tourCount > 0) {
      return res.redirect('/admin/destinations?error=' + encodeURIComponent(`Cannot delete: ${tourCount} tour(s) are linked to this destination.`));
    }

    await Destination.destroy({ where: { id } });
    res.redirect('/admin/destinations?success=' + encodeURIComponent('Destination deleted successfully.'));
  } catch (err) {
    next(err);
  }
};

/* ==========================================================================
   Category CRUD Management
   ========================================================================== */

const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Tour, as: 'tours', required: false }],
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/categories/index', {
      title: 'Manage Tour Categories | Admin',
      metaTitle: 'Tour Categories',
      metaDescription: 'Manage tour categories and icons',
      categories,
      formatDate,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    next(err);
  }
};

const postAdminCreateCategory = async (req, res, next) => {
  try {
    const { name, slug: customSlug, description, icon } = req.body;
    const slug = customSlug ? slugify(customSlug) : slugify(name);

    let image = null;
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }

    await Category.create({
      name,
      slug,
      description,
      icon: icon || 'bi bi-compass',
      image
    });

    res.redirect('/admin/categories?success=' + encodeURIComponent('New tour category created successfully!'));
  } catch (err) {
    next(err);
  }
};

const getAdminEditCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.redirect('/admin/categories?error=' + encodeURIComponent('Category not found.'));
    }

    res.render('pages/admin/categories/edit', {
      title: 'Edit Category | Admin',
      metaTitle: 'Edit Category',
      metaDescription: 'Update category details',
      category
    });
  } catch (err) {
    next(err);
  }
};

const postAdminEditCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug: customSlug, description, icon } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.redirect('/admin/categories?error=' + encodeURIComponent('Category not found.'));
    }

    category.name = name;
    if (customSlug) {
      category.slug = slugify(customSlug);
    } else if (name && name !== category.name) {
      category.slug = slugify(name);
    }

    category.description = description;
    category.icon = icon || category.icon;

    if (req.file) {
      category.image = '/uploads/' + req.file.filename;
    }

    await category.save();
    res.redirect('/admin/categories?success=' + encodeURIComponent('Category updated successfully!'));
  } catch (err) {
    next(err);
  }
};

const postAdminDeleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tourCount = await Tour.count({ where: { categoryId: id } });

    if (tourCount > 0) {
      return res.redirect('/admin/categories?error=' + encodeURIComponent(`Cannot delete: ${tourCount} tour(s) are assigned to this category.`));
    }

    await Category.destroy({ where: { id } });
    res.redirect('/admin/categories?success=' + encodeURIComponent('Category deleted successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * Manage Coupons
 */
const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('pages/admin/coupons/index', {
      title: 'Manage Coupons | Admin',
      metaTitle: 'Coupons',
      metaDescription: 'Manage promotional coupons',
      coupons,
      formatCurrency,
      formatDate,
      success: req.query.success || null
    });
  } catch (err) {
    next(err);
  }
};

const postAdminCreateCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minBookingAmount, expiresAt } = req.body;
    await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minBookingAmount: parseFloat(minBookingAmount || '0'),
      expiresAt
    });
    res.redirect('/admin/coupons?success=' + encodeURIComponent('Coupon created!'));
  } catch (err) {
    next(err);
  }
};

/**
 * Contact Messages & Newsletter Subscribers
 */
const getAdminContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.render('pages/admin/contacts/index', {
      title: 'Contact Submissions | Admin',
      metaTitle: 'Contact Messages',
      metaDescription: 'Customer contact form submissions',
      contacts,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

const getAdminNewsletters = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.findAll({ order: [['createdAt', 'DESC']] });
    res.render('pages/admin/newsletters/index', {
      title: 'Newsletter Subscribers | Admin',
      metaTitle: 'Subscribers List',
      metaDescription: 'Email newsletter subscribers',
      subscribers,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Website Settings
 */
const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();
    res.render('pages/admin/settings/index', {
      title: 'Website Settings | Admin',
      metaTitle: 'System Settings',
      metaDescription: 'Manage website configuration and SEO metadata',
      settings,
      success: req.query.success || null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Quick Create Category (AJAX Inline)
 */
const postAdminQuickCreateCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const slug = slugify(name);
    const category = await Category.create({
      name: name.trim(),
      slug,
      icon: icon || 'bi bi-compass-fill',
      description: description || ''
    });
    return res.json({ success: true, category });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Quick Create Destination (AJAX Inline)
 */
const postAdminQuickCreateDestination = async (req, res) => {
  try {
    const { name, country } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Destination name is required.' });
    }
    const slug = slugify(name);
    const destination = await Destination.create({
      name: name.trim(),
      slug,
      country: country || name.trim(),
      banner: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      description: name.trim()
    });
    return res.json({ success: true, destination });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdminDashboard,
  getAdminTours,
  getAdminCreateTour,
  postAdminCreateTour,
  getAdminEditTour,
  postAdminEditTour,
  postAdminDeleteTour,
  postAdminDeleteTourImage,
  getAdminBookings,
  postAdminUpdateBookingStatus,
  getAdminCustomers,
  getAdminReviews,
  postAdminApproveReview,
  getAdminDestinations,
  getAdminCreateDestination,
  postAdminCreateDestination,
  getAdminEditDestination,
  postAdminEditDestination,
  postAdminDeleteDestination,
  getAdminCategories,
  postAdminCreateCategory,
  getAdminEditCategory,
  postAdminEditCategory,
  postAdminDeleteCategory,
  postAdminQuickCreateCategory,
  postAdminQuickCreateDestination,
  getAdminCoupons,
  postAdminCreateCoupon,
  getAdminContacts,
  getAdminNewsletters,
  getAdminSettings
};
