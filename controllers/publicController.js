const { Tour, Destination, Category, Review, Blog, Contact, NewsletterSubscriber, User } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * Home Page Controller
 */
const getHome = async (req, res, next) => {
  try {
    const featuredTours = await Tour.findAll({
      where: { isFeatured: true, status: 'active' },
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      limit: 6
    });

    const bestSellerTours = await Tour.findAll({
      where: { isBestSeller: true, status: 'active' },
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      limit: 6
    });

    const popularDestinations = await Destination.findAll({
      where: { isPopular: true },
      limit: 6
    });

    const categories = await Category.findAll();

    const customerReviews = await Review.findAll({
      where: { status: 'approved' },
      include: [
        { model: User, as: 'user', attributes: ['name', 'avatar'] },
        { model: Tour, as: 'tour', attributes: ['name', 'slug'] }
      ],
      limit: 6
    });

    const latestBlogs = await Blog.findAll({
      where: { isPublished: true },
      include: [
        { model: User, as: 'author', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    const schemaOrg = generateSchemaOrg.organization('Tranoi Travel', process.env.APP_URL || 'https://tranoitravel.com');

    res.render('pages/index', {
      title: 'Tranoi Travel | Travel more, plan less',
      metaTitle: 'Tranoi Travel - Travel More, Plan Less',
      metaDescription: 'Tailored, curated travel itineraries within our specialty destinations. Travel more, plan less with Tranoi Travel.',
      featuredTours,
      bestSellerTours,
      popularDestinations,
      categories,
      customerReviews,
      latestBlogs,
      schemaOrg,
      formatCurrency,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * About Page Controller
 */
const getAbout = (req, res) => {
  res.render('pages/about', {
    title: 'About Us | Tranoi Travel',
    metaTitle: 'About Tranoi Travel - Travel More, Plan Less',
    metaDescription: 'Learn about Tranoi Travel and our approach to curated, tailored itineraries within specialty destinations.'
  });
};

/**
 * Contact Page Controller
 */
const getContact = (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us | Tranoi Travel',
    metaTitle: 'Contact Tranoi Travel Support Team',
    metaDescription: 'Get in touch with our travel specialists for curated tour inquiries and booking assistance.',
    success: req.query.success || null,
    error: req.query.error || null
  });
};

/**
 * Submit Contact Form
 */
const postContact = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    await Contact.create({ name, email, phone, subject, message });
    res.redirect('/contact?success=' + encodeURIComponent('Thank you for contacting us! Our team will respond within 24 hours.'));
  } catch (err) {
    next(err);
  }
};

/**
 * FAQ Page Controller
 */
const getFAQ = (req, res) => {
  const faqs = [
    { question: 'How do I book a tour on Tranoi Travel?', answer: 'Simply browse our tours, select your departure date and guest count, click Book Now, and complete the instant checkout process using Stripe payment.' },
    { question: 'What is your tour cancellation policy?', answer: 'Cancellations made 14 days or more before the departure date qualify for a full 100% refund. Cancellations between 7 and 13 days qualify for a 50% refund.' },
    { question: 'Are airport transfers included in tours?', answer: 'Yes, most of our multi-day packages include private VIP air-conditioned airport pick-up and drop-off.' },
    { question: 'Can I apply promotional coupons?', answer: 'Yes, during checkout on the payment step, enter your coupon code (e.g. WELCOME10) to enjoy instant savings.' },
    { question: 'Is my payment secure?', answer: 'Absolutely. We use Stripe Payment Gateway with 256-bit SSL encryption. We never store credit card numbers directly on our servers.' }
  ];

  const schemaOrg = generateSchemaOrg.faq(faqs);

  res.render('pages/faq', {
    title: 'Frequently Asked Questions | Tranoi Travel',
    metaTitle: 'Tranoi Travel FAQ - Booking & Travel Help',
    metaDescription: 'Find answers to common questions regarding booking, payments, tour cancellations, and airport transfers.',
    faqs,
    schemaOrg
  });
};

/**
 * Privacy Policy Page
 */
const getPrivacy = (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy | Tranoi Travel',
    metaTitle: 'Privacy Policy - Tranoi Travel',
    metaDescription: 'Read our privacy policy regarding how we protect and manage your personal travel information.'
  });
};

/**
 * Terms & Conditions Page
 */
const getTerms = (req, res) => {
  res.render('pages/terms', {
    title: 'Terms & Conditions | Tranoi Travel',
    metaTitle: 'Terms & Conditions - Tranoi Travel',
    metaDescription: 'Terms of service and user agreements for booking tours with Tranoi Travel.'
  });
};

/**
 * Newsletter Subscription API
 */
const postSubscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  try {
    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email },
      defaults: { isSubscribed: true }
    });

    if (!created && !subscriber.isSubscribed) {
      subscriber.isSubscribed = true;
      await subscriber.save();
    }

    return res.json({ success: true, message: 'Thank you for subscribing to our travel newsletter!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not subscribe. Please try again later.' });
  }
};

/**
 * Search Autocomplete API
 */
const searchAutocomplete = async (req, res) => {
  const query = req.query.q || '';
  if (query.length < 2) return res.json({ tours: [], destinations: [] });

  try {
    const tours = await Tour.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
        status: 'active'
      },
      attributes: ['id', 'name', 'slug', 'featuredImage', 'price'],
      limit: 5
    });

    const destinations = await Destination.findAll({
      where: {
        name: { [Op.like]: `%${query}%` }
      },
      attributes: ['id', 'name', 'slug', 'banner'],
      limit: 5
    });

    return res.json({ tours, destinations });
  } catch (err) {
    return res.status(500).json({ tours: [], destinations: [] });
  }
};

module.exports = {
  getHome,
  getAbout,
  getContact,
  postContact,
  getFAQ,
  getPrivacy,
  getTerms,
  postSubscribeNewsletter,
  searchAutocomplete
};
