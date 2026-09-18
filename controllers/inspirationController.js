const { Itinerary, Guide, SignatureExperience, CustomerStory, Tour, Destination, Review, User } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * Itineraries Hub (/trips) - Grouped primarily by Duration (7, 10, 14, 21 days)
 */
const getTrips = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.findAll({
      order: [['duration', 'ASC']]
    });

    // Group itineraries by duration (7, 10, 14, 21 days) per Sitemap Section 4
    const groupedItineraries = {
      7: itineraries.filter(i => i.duration === 7),
      10: itineraries.filter(i => i.duration === 10),
      14: itineraries.filter(i => i.duration === 14),
      21: itineraries.filter(i => i.duration === 21)
    };

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Itineraries', url: '/trips' }
    ], process.env.APP_URL);

    res.render('pages/trips-hub', {
      title: 'Vietnam Route Itineraries by Duration | Tranoi Travel',
      metaTitle: 'Curated Vietnam Travel Itineraries by Duration',
      metaDescription: 'Explore our editorial Vietnam route ideas grouped by 7, 10, 14, and 21 days. Travel more, plan less with Tranoi Travel.',
      itineraries,
      groupedItineraries,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Itinerary Detail (/trips/:slug) - Pure editorial, soft link to matching tours
 */
const getTripDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const itinerary = await Itinerary.findOne({ where: { slug } });

    if (!itinerary) {
      return res.status(404).render('pages/404', {
        title: 'Itinerary Not Found',
        metaTitle: 'Itinerary Not Found',
        metaDescription: 'The requested route itinerary does not exist.',
        message: 'The travel itinerary route you are looking for could not be found.'
      });
    }

    // Parse route ideas and fetch matching tours
    let routeIdeas = [];
    if (itinerary.routeIdeas) {
      try {
        routeIdeas = typeof itinerary.routeIdeas === 'string' ? JSON.parse(itinerary.routeIdeas) : itinerary.routeIdeas;
      } catch (e) {
        routeIdeas = [];
      }
    }

    // Find related tours
    const matchingTours = await Tour.findAll({
      where: {
        durationDays: itinerary.duration,
        status: 'active'
      },
      include: [{ model: Destination, as: 'destination' }]
    });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Itineraries', url: '/trips' },
      { name: itinerary.title, url: `/trips/${itinerary.slug}` }
    ], process.env.APP_URL);

    res.render('pages/trip-detail', {
      title: `${itinerary.title} | Tranoi Travel`,
      metaTitle: itinerary.metaTitle || itinerary.title,
      metaDescription: itinerary.metaDescription || itinerary.summary,
      itinerary,
      routeIdeas,
      matchingTours,
      schemaOrg: breadcrumbSchema,
      formatCurrency,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Travel Guides Hub (/guides)
 */
const getGuides = async (req, res, next) => {
  try {
    const guides = await Guide.findAll({
      order: [['createdAt', 'DESC']]
    });

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Travel Guides', url: '/guides' }
    ], process.env.APP_URL);

    res.render('pages/guides-hub', {
      title: 'Vietnam Travel Guides & Trip Planning | Tranoi Travel',
      metaTitle: 'Expert Vietnam Travel Guides and Practical Advice',
      metaDescription: 'Read our expert guides on visas, seasons, private vs partial-guided touring, and practical tips.',
      guides,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Travel Guide Detail (/guides/:slug)
 */
const getGuideDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const guide = await Guide.findOne({ where: { slug } });

    if (!guide) {
      return res.status(404).render('pages/404', {
        title: 'Guide Not Found',
        metaTitle: 'Guide Not Found',
        metaDescription: 'The requested travel guide does not exist.',
        message: 'The travel guide you are looking for could not be found.'
      });
    }

    const otherGuides = await Guide.findAll({
      where: { id: { [Op.ne]: guide.id } },
      limit: 3
    });

    const featuredTours = await Tour.findAll({
      where: { status: 'active' },
      limit: 2
    });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Travel Guides', url: '/guides' },
      { name: guide.title, url: `/guides/${guide.slug}` }
    ], process.env.APP_URL);

    res.render('pages/guide-detail', {
      title: `${guide.title} | Tranoi Travel`,
      metaTitle: guide.metaTitle || guide.title,
      metaDescription: guide.metaDescription || guide.excerpt,
      guide,
      otherGuides,
      featuredTours,
      schemaOrg: breadcrumbSchema,
      formatCurrency
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Signature Experiences Hub (/experiences)
 */
const getExperiences = async (req, res, next) => {
  try {
    const experiences = await SignatureExperience.findAll();

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Signature Experiences', url: '/experiences' }
    ], process.env.APP_URL);

    res.render('pages/experiences-hub', {
      title: 'Signature Experiences: What Makes Tranoi Travel Different',
      metaTitle: 'Signature Experiences and The Tranoi Difference',
      metaDescription: 'Learn what partial-guided touring feels like, how we handpick local insiders, and our on-trip care promise.',
      experiences,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Signature Experience Detail (/experiences/:slug)
 */
const getExperienceDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const experience = await SignatureExperience.findOne({ where: { slug } });

    if (!experience) {
      return res.status(404).render('pages/404', {
        title: 'Experience Not Found',
        metaTitle: 'Experience Not Found',
        metaDescription: 'The requested experience does not exist.',
        message: 'The signature experience you are looking for could not be found.'
      });
    }

    const otherExperiences = await SignatureExperience.findAll({
      where: { id: { [Op.ne]: experience.id } },
      limit: 2
    });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Signature Experiences', url: '/experiences' },
      { name: experience.title, url: `/experiences/${experience.slug}` }
    ], process.env.APP_URL);

    res.render('pages/experience-detail', {
      title: `${experience.title} | Tranoi Travel`,
      metaTitle: experience.metaTitle || experience.title,
      metaDescription: experience.metaDescription || experience.excerpt,
      experience,
      otherExperiences,
      schemaOrg: breadcrumbSchema
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Customer Stories Hub (/customer-stories)
 */
const getCustomerStories = async (req, res, next) => {
  try {
    const stories = await CustomerStory.findAll({
      order: [['createdAt', 'DESC']]
    });

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Customer Stories', url: '/customer-stories' }
    ], process.env.APP_URL);

    res.render('pages/customer-stories-hub', {
      title: 'Real Traveler Stories and Vietnam Journeys | Tranoi Travel',
      metaTitle: 'Customer Stories - Real Vietnam Trip Reviews',
      metaDescription: 'Read long-form real stories from travelers who explored Vietnam with Tranoi Travel.',
      stories,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Customer Story Detail (/customer-stories/:slug)
 */
const getCustomerStoryDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const story = await CustomerStory.findOne({ where: { slug } });

    if (!story) {
      return res.status(404).render('pages/404', {
        title: 'Story Not Found',
        metaTitle: 'Story Not Found',
        metaDescription: 'The requested customer story does not exist.',
        message: 'The customer story you are looking for could not be found.'
      });
    }

    // Find linked tour if any
    let linkedTour = null;
    if (story.tourSlug) {
      linkedTour = await Tour.findOne({
        where: { slug: story.tourSlug },
        include: [{ model: Destination, as: 'destination' }]
      });
    }

    const otherStories = await CustomerStory.findAll({
      where: { id: { [Op.ne]: story.id } },
      limit: 2
    });

    let gallery = [];
    if (story.gallery) {
      try {
        gallery = typeof story.gallery === 'string' ? JSON.parse(story.gallery) : story.gallery;
      } catch (e) {
        gallery = [];
      }
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Customer Stories', url: '/customer-stories' },
      { name: story.title, url: `/customer-stories/${story.slug}` }
    ], process.env.APP_URL);

    res.render('pages/customer-story-detail', {
      title: `${story.title} | Tranoi Travel`,
      metaTitle: story.metaTitle || story.title,
      metaDescription: story.metaDescription || story.travelerQuote,
      story,
      gallery,
      linkedTour,
      otherStories,
      schemaOrg: breadcrumbSchema,
      formatCurrency
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Trip Reviews Hub (/trip-reviews) - Filterable by Tour & Destination
 */
const getTripReviews = async (req, res, next) => {
  try {
    const { tourId, destinationId } = req.query;

    const whereClause = { status: 'approved' };
    if (tourId) whereClause.tourId = tourId;

    const reviews = await Review.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['name', 'avatar'] },
        {
          model: Tour,
          as: 'tour',
          attributes: ['id', 'name', 'slug', 'featuredImage', 'destinationId'],
          include: [{ model: Destination, as: 'destination', attributes: ['id', 'name'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const tours = await Tour.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'slug']
    });

    const destinations = await Destination.findAll({
      where: { navFeatured: true },
      attributes: ['id', 'name', 'slug']
    });

    const customerStories = await CustomerStory.findAll({ limit: 2 });

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Trip Reviews', url: '/trip-reviews' }
    ], process.env.APP_URL);

    res.render('pages/trip-reviews', {
      title: 'Verified Traveler Reviews & Ratings | Tranoi Travel',
      metaTitle: 'Tranoi Travel Trip Reviews and Traveler Ratings',
      metaDescription: 'Browse real traveler reviews and ratings from our private and partial-guided Vietnam journeys.',
      reviews,
      tours,
      destinations,
      customerStories,
      query: req.query,
      schemaOrg,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTrips,
  getTripDetail,
  getGuides,
  getGuideDetail,
  getExperiences,
  getExperienceDetail,
  getCustomerStories,
  getCustomerStoryDetail,
  getTripReviews
};
