const { Tour, Destination, Category, Review, TourSchedule, TourImage, User } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * List Tours Directory Page (/tours)
 * Filterable by Duration, Format (Private, Partial-guided), Region, Theme
 */
const getTours = async (req, res, next) => {
  try {
    const { destination, format, duration, region, theme } = req.query;
    const searchQuery = (req.query.search || req.query.q || '').trim();

    let whereClause = { status: 'active' };

    // Search Query
    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { shortDescription: { [Op.like]: `%${searchQuery}%` } },
        { departureLocation: { [Op.like]: `%${searchQuery}%` } }
      ];
    }

    // Duration filter (7, 10, 14, 21 days)
    if (duration) {
      const durDays = parseInt(duration, 10);
      if (!isNaN(durDays)) {
        whereClause.durationDays = durDays;
      }
    }

    // Format filter ('private' or 'partial-guided')
    if (format) {
      whereClause.formats = { [Op.like]: `%${format}%` };
    }

    // Region filter ('north', 'central', 'south', 'multi-region')
    if (region && region !== 'all') {
      whereClause.region = region;
    }

    // Theme filter
    if (theme && theme !== 'all') {
      whereClause.theme = { [Op.like]: `%${theme}%` };
    }

    const allTours = await Tour.findAll({
      where: whereClause,
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      order: [['durationDays', 'ASC']]
    });

    const destinations = await Destination.findAll({
      where: { navFeatured: true }
    });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' }
    ], process.env.APP_URL);

    res.render('pages/tours', {
      title: searchQuery ? `Search Results for "${searchQuery}" | Tranoi Travel` : 'Curated Vietnam Tours: Private & Partial-Guided | Tranoi Travel',
      metaTitle: 'Vietnam Tour Packages: Private & Partial-Guided | Tranoi Travel',
      metaDescription: 'Filter by duration (7, 10, 14, 21 days), format (private or partial-guided), region, and theme. Handcrafted Vietnam travel by Tranoi Travel.',
      allTours,
      destinations,
      query: req.query,
      searchQuery,
      schemaOrg: breadcrumbSchema,
      formatCurrency,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Category Landing Page Controller
 */
const getCategorySilo = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug },
      include: [
        {
          model: Tour,
          as: 'tours',
          where: { status: 'active' },
          required: false,
          include: [{ model: Destination, as: 'destination' }, { model: Category, as: 'category' }]
        }
      ]
    });

    if (!category) {
      return res.status(404).render('pages/404', {
        title: 'Category Not Found',
        metaTitle: 'Category Not Found',
        metaDescription: 'The requested category does not exist.',
        message: 'The tour category you are looking for could not be found.'
      });
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' },
      { name: category.name, url: `/tours/category/${category.slug}` }
    ], process.env.APP_URL);

    res.render('pages/tour-category-silo', {
      title: `${category.name} Tour Packages | Tranoi Travel`,
      metaTitle: `${category.name} - Vietnam Tours`,
      metaDescription: category.description || `Explore ${category.name} tours in Vietnam.`,
      category,
      tours: category.tours || [],
      schemaOrg: breadcrumbSchema,
      formatCurrency,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Tour Detail Controller (/tours/:slug)
 * Supplies Private and Partial-guided format data, inclusions, day-by-day, route map
 */
const getTourDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const tour = await Tour.findOne({
      where: { slug, status: 'active' },
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' },
        { model: TourSchedule, as: 'schedules', where: { status: 'open' }, required: false },
        { model: TourImage, as: 'images' },
        {
          model: Review,
          as: 'reviews',
          where: { status: 'approved' },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['name', 'avatar'] }]
        }
      ]
    });

    if (!tour) {
      return res.status(404).render('pages/404', {
        title: 'Tour Not Found - Tranoi Travel',
        metaTitle: 'Tour Not Found',
        metaDescription: 'The requested tour does not exist.',
        message: 'The tour you are searching for is unavailable or has been archived.'
      });
    }

    // Parse JSON data safely
    let formats = ['private', 'partial-guided'];
    if (tour.formats) {
      try {
        formats = typeof tour.formats === 'string' ? JSON.parse(tour.formats) : tour.formats;
      } catch (e) {
        formats = ['private', 'partial-guided'];
      }
    }

    let highlights = [];
    if (tour.highlights) {
      try {
        highlights = typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : tour.highlights;
      } catch (e) {
        highlights = [];
      }
    }

    let itinerary = [];
    if (tour.itinerary) {
      try {
        itinerary = typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary;
      } catch (e) {
        itinerary = [];
      }
    }

    let includedPrivate = [];
    if (tour.includedPrivate) {
      try {
        includedPrivate = typeof tour.includedPrivate === 'string' ? JSON.parse(tour.includedPrivate) : tour.includedPrivate;
      } catch (e) {
        includedPrivate = [];
      }
    }

    let includedPartialGuided = [];
    if (tour.includedPartialGuided) {
      try {
        includedPartialGuided = typeof tour.includedPartialGuided === 'string' ? JSON.parse(tour.includedPartialGuided) : tour.includedPartialGuided;
      } catch (e) {
        includedPartialGuided = [];
      }
    }

    let excludedPrivate = [];
    if (tour.excludedPrivate) {
      try {
        excludedPrivate = typeof tour.excludedPrivate === 'string' ? JSON.parse(tour.excludedPrivate) : tour.excludedPrivate;
      } catch (e) {
        excludedPrivate = [];
      }
    }

    let excludedPartialGuided = [];
    if (tour.excludedPartialGuided) {
      try {
        excludedPartialGuided = typeof tour.excludedPartialGuided === 'string' ? JSON.parse(tour.excludedPartialGuided) : tour.excludedPartialGuided;
      } catch (e) {
        excludedPartialGuided = [];
      }
    }

    let routeMapPoints = [];
    if (tour.routeMapPoints) {
      try {
        routeMapPoints = typeof tour.routeMapPoints === 'string' ? JSON.parse(tour.routeMapPoints) : tour.routeMapPoints;
      } catch (e) {
        routeMapPoints = [];
      }
    }

    // Related tours
    const relatedTours = await Tour.findAll({
      where: {
        id: { [Op.ne]: tour.id },
        status: 'active'
      },
      include: [{ model: Destination, as: 'destination' }],
      limit: 3
    });

    const schemaOrg = generateSchemaOrg.touristTrip(tour, process.env.APP_URL);
    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' },
      { name: tour.name, url: `/tours/${tour.slug}` }
    ], process.env.APP_URL);

    res.render('pages/tour-detail', {
      title: `${tour.name} | Tranoi Travel`,
      metaTitle: tour.metaTitle || `${tour.name} - Tour Booking`,
      metaDescription: tour.metaDescription || tour.shortDescription,
      tour,
      formats,
      highlights,
      itinerary,
      includedPrivate,
      includedPartialGuided,
      excludedPrivate,
      excludedPartialGuided,
      routeMapPoints,
      relatedTours,
      schemaOrg: `${schemaOrg}\n${breadcrumbSchema}`,
      formatCurrency,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTours,
  getCategorySilo,
  getTourDetail
};
