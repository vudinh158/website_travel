const { Tour, Destination, Category, Review, Contact, NewsletterSubscriber, CustomerStory, Guide, User } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * Home Page Controller
 */
const getHome = async (req, res, next) => {
  try {
    // All active seed tours
    const seedTours = await Tour.findAll({
      where: { status: 'active' },
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      order: [['durationDays', 'ASC']],
      limit: 4
    });

    // P0 Destinations for featured grid
    const p0Destinations = await Destination.findAll({
      where: { navFeatured: true },
      limit: 6
    });

    // Customer Stories for inspiration carousel
    const customerStories = await CustomerStory.findAll({
      limit: 3
    });

    // Reviews for social proof
    const customerReviews = await Review.findAll({
      where: { status: 'approved' },
      include: [
        { model: User, as: 'user', attributes: ['name', 'avatar'] },
        { model: Tour, as: 'tour', attributes: ['name', 'slug'] }
      ],
      limit: 4
    });

    // Travel Guides
    const travelGuides = await Guide.findAll({
      limit: 3,
      order: [['createdAt', 'DESC']]
    });

    const schemaOrg = generateSchemaOrg.organization('Tranoi Travel', process.env.APP_URL || 'https://tranoitravel.com');

    res.render('pages/index', {
      title: 'Tranoi Travel | Travel more, plan less',
      metaTitle: 'Tranoi Travel: Tailored Vietnam Tours (Private & Partial-Guided)',
      metaDescription: 'Specialty travel agency offering tailored, curated Vietnam trips. Private and partial-guided long-duration tours. Travel more, plan less.',
      seedTours,
      p0Destinations,
      customerStories,
      customerReviews,
      travelGuides,
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
 * About Us (Who We Are) Controller (/about-us and /about)
 */
const getAbout = (req, res) => {
  res.render('pages/about', {
    title: 'Who We Are | Tranoi Travel',
    metaTitle: 'Who We Are: About Tranoi Travel',
    metaDescription: 'Learn about Tranoi Travel, our philosophy of curated trips within our specialty expertise, and why we do not believe in mass tourism.'
  });
};

/**
 * How It Works Controller (/how-it-works)
 */
const getHowItWorks = (req, res) => {
  res.render('pages/how-it-works', {
    title: 'How It Works | Tranoi Travel',
    metaTitle: 'How It Works: Curated Itineraries & The Partial-Guided Model',
    metaDescription: 'Discover our 4-step travel process: from choosing your curated itinerary to on-trip 24/7 concierge support.'
  });
};

/**
 * Meet the Team Controller (/meet-the-team)
 */
const getMeetTheTeam = (req, res) => {
  res.render('pages/meet-the-team', {
    title: 'Meet the Team | Tranoi Travel',
    metaTitle: 'Meet the Tranoi Travel Team in Vietnam',
    metaDescription: 'Meet our local travel curators, route designers, and concierge directors based on the ground in Hanoi and Saigon.'
  });
};

/**
 * Responsible Travel Controller (/responsible-travel)
 */
const getResponsibleTravel = (req, res) => {
  res.render('pages/responsible-travel', {
    title: 'Responsible Travel Commitment | Tranoi Travel',
    metaTitle: 'Responsible & Sustainable Tourism in Vietnam',
    metaDescription: 'Our pledge to environmental conservation, fair artisan compensation, and zero-plastic initiatives.'
  });
};

/**
 * Loyalty Program Controller (/loyalty-program)
 */
const getLoyaltyProgram = (req, res) => {
  res.render('pages/loyalty-program', {
    title: 'Loyalty Program & Explorer Club | Tranoi Travel',
    metaTitle: 'Tranoi Explorer Club: Returning Guest Benefits',
    metaDescription: 'Learn about exclusive privileges, private room upgrades, and future trip credits for returning Tranoi Travel guests.'
  });
};

/**
 * Contact Page Controller (/contact)
 */
const getContact = (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Our Vietnam Travel Specialists | Tranoi Travel',
    metaTitle: 'Contact Tranoi Travel: Plan Your Vietnam Trip',
    metaDescription: 'Speak with our Vietnam destination specialists. We reply to all inquiries within 24 hours.',
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
    res.redirect('/thank-you?name=' + encodeURIComponent(name || 'Traveler'));
  } catch (err) {
    next(err);
  }
};

/**
 * Submit Tour Enquiry Modal Form (/enquiry)
 */
const postEnquiry = async (req, res, next) => {
  try {
    const { tourName, tourSlug, format, name, email, phone, departureDate, guests, notes } = req.body;

    const fullMessage = `Tour Inquiry: ${tourName} (${tourSlug})
Selected Format: ${format || 'Flexible'}
Estimated Departure: ${departureDate || 'Unspecified'}
Guests: ${guests || 1}
Notes: ${notes || 'No additional notes'}`;

    await Contact.create({
      name: name || 'Interested Traveler',
      email: email,
      phone: phone || '',
      subject: `Tour Enquiry: ${tourName} [${format || 'Private/Partial-Guided'}]`,
      message: fullMessage
    });

    res.redirect(`/thank-you?tour=${encodeURIComponent(tourName || '')}&name=${encodeURIComponent(name || 'Traveler')}`);
  } catch (err) {
    next(err);
  }
};

/**
 * Thank You Page (/thank-you) - Confirms submission, reply expectation, 15-min call
 */
const getThankYou = (req, res) => {
  const tourName = req.query.tour || '';
  const travelerName = req.query.name || 'Traveler';

  res.render('pages/thank-you', {
    title: 'Thank You for Your Enquiry | Tranoi Travel',
    metaTitle: 'Thank You for Contacting Tranoi Travel',
    metaDescription: 'Your travel inquiry has been received. Our Vietnam specialists will respond within 24 hours.',
    tourName,
    travelerName
  });
};

/**
 * FAQ Page Controller (/faq)
 */
const getFAQ = (req, res) => {
  const faqs = [
    {
      question: 'What does "partial-guided" mean on Tranoi Travel tours?',
      answer: 'Partial-guided means our certified local guides lead you through complex cultural landmarks (like the Imperial Citadel or street food guilds), while leaving generous unguided afternoons and evenings for you to discover cafes, shops, and beaches at your own natural pace. All logistics, transfers, and accommodations remain 100% arranged and managed by us.'
    },
    {
      question: 'Can I choose between Private and Partial-Guided formats?',
      answer: 'Yes! On every tour page, you will find an interactive toggle between Private and Partial-guided formats. The Private option includes a dedicated guide and chauffeured vehicle for your party at every moment, while Partial-guided offers a balance of guided highlights and independent free time at a lower cost.'
    },
    {
      question: 'Are domestic flights in Vietnam included in your tours?',
      answer: 'Yes. For tours connecting multiple regions (e.g. Hanoi to Hue, or Da Nang to Ho Chi Minh City), domestic flights on quality carriers such as Vietnam Airlines are included with 23kg checked luggage and private airport transfers.'
    },
    {
      question: 'How does your 24/7 concierge support work while on the trip?',
      answer: 'Before you land in Vietnam, we set up a private WhatsApp channel connecting you directly to your assigned local tour coordinator. Whether you want a restaurant recommendation, need a schedule adjustment, or have a question, our Hanoi and Saigon team responds in minutes.'
    },
    {
      question: 'What is your cancellation and refund policy?',
      answer: 'We offer a flexible booking policy. Cancellations received 14 days or more prior to departure qualify for a full refund minus unrecoverable third-party permits. Between 7 and 13 days, a 50% refund is issued.'
    },
    {
      question: 'How do I submit an inquiry or book a consultation call?',
      answer: 'Simply submit the inquiry form on any tour page or via our Contact page. Our travel specialists will send a tailored proposal within 24 hours, and you can also schedule a complimentary 15-minute consultation call.'
    }
  ];

  const schemaOrg = generateSchemaOrg.faq(faqs);

  res.render('pages/faq', {
    title: 'Frequently Asked Questions | Tranoi Travel',
    metaTitle: 'Tranoi Travel FAQ: Private vs Partial-Guided & Booking Information',
    metaDescription: 'Find answers regarding our partial-guided travel model, private tours, domestic flights, and booking policies.',
    faqs,
    schemaOrg
  });
};

/**
 * Privacy Policy Page (/privacy-policy and /privacy)
 */
const getPrivacy = (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy | Tranoi Travel',
    metaTitle: 'Privacy Policy: Tranoi Travel',
    metaDescription: 'Read our privacy policy regarding how we protect your personal travel data.'
  });
};

/**
 * Terms & Conditions Page (/terms-conditions and /terms)
 */
const getTerms = (req, res) => {
  res.render('pages/terms', {
    title: 'Terms & Conditions | Tranoi Travel',
    metaTitle: 'Booking Terms and Conditions: Tranoi Travel',
    metaDescription: 'Review our booking conditions, payment terms, and cancellation policies.'
  });
};

/**
 * Newsletter Subscription (/newsletter/subscribe)
 */
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email },
      defaults: { status: 'active' }
    });
    return res.json({
      success: true,
      message: created ? 'Thank you for subscribing to Tranoi Travel insider notes!' : 'You are already subscribed to our newsletter.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to process subscription.' });
  }
};

const searchAutocomplete = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, results: { tours: [], destinations: [] } });
    }

    const tours = await Tour.findAll({
      where: {
        status: 'active',
        name: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'name', 'slug', 'featuredImage', 'price'],
      limit: 5
    });

    const destinations = await Destination.findAll({
      where: {
        name: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'name', 'slug', 'banner'],
      limit: 5
    });

    return res.json({
      success: true,
      results: {
        tours,
        destinations
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const postSubscribeNewsletter = subscribeNewsletter;

module.exports = {
  getHome,
  getAbout,
  getHowItWorks,
  getMeetTheTeam,
  getResponsibleTravel,
  getLoyaltyProgram,
  getContact,
  postContact,
  postEnquiry,
  getThankYou,
  getFAQ,
  getPrivacy,
  getTerms,
  subscribeNewsletter,
  postSubscribeNewsletter,
  searchAutocomplete
};
