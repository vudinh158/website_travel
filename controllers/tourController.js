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
    const { destination, format, duration, region, theme, pace, sort, minPrice, maxPrice } = req.query;
    const searchQuery = (req.query.search || req.query.q || '').trim();
    const numberOfAdults = parseInt(req.query.numberOfAdults || req.query.adults || '2', 10) || 2;
    const anytime = req.query.anytime === 'false' ? false : true;

    let whereClause = { status: 'active' };

    // Search Query
    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { shortDescription: { [Op.like]: `%${searchQuery}%` } },
        { departureLocation: { [Op.like]: `%${searchQuery}%` } },
        { routeMapPoints: { [Op.like]: `%${searchQuery}%` } },
        { highlights: { [Op.like]: `%${searchQuery}%` } }
      ];
    }

    // Duration filter ('5-7', '8-10', '11-14', '15-21', '21+' or ranges)
    if (duration) {
      const durStr = String(duration).trim().toLowerCase();
      if (durStr === '5-7' || durStr === '5_7') {
        whereClause.durationDays = { [Op.between]: [5, 7] };
      } else if (durStr === '5-10' || durStr === '5_10') {
        whereClause.durationDays = { [Op.between]: [5, 10] };
      } else if (durStr === '8-10' || durStr === '8_10') {
        whereClause.durationDays = { [Op.between]: [8, 10] };
      } else if (durStr === '11-14' || durStr === '11_14') {
        whereClause.durationDays = { [Op.between]: [11, 14] };
      } else if (durStr === '15-21' || durStr === '15_21') {
        whereClause.durationDays = { [Op.between]: [15, 21] };
      } else if (durStr === '21+' || durStr === '21plus' || durStr === '21-plus' || durStr === '21%2b') {
        whereClause.durationDays = { [Op.gte]: 21 };
      } else if (durStr.includes('-')) {
        const parts = durStr.split('-').map(p => parseInt(p, 10)).filter(n => !isNaN(n));
        if (parts.length === 2) {
          whereClause.durationDays = { [Op.between]: [Math.min(...parts), Math.max(...parts)] };
        }
      } else {
        const durDays = parseInt(duration, 10);
        if (!isNaN(durDays)) {
          whereClause.durationDays = durDays;
        }
      }
    }

    // Format filter ('private' or 'partial-guided')
    if (format && format !== 'all') {
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

    // Pace filter ('Relaxed', 'Moderate', 'Active')
    if (pace && pace !== 'all') {
      whereClause.pace = { [Op.like]: `%${pace}%` };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const minP = parseFloat(minPrice) || 0;
      const maxP = parseFloat(maxPrice) || 999999;
      whereClause[Op.or] = [
        { pricePartialGuided: { [Op.between]: [minP, maxP] } },
        { price: { [Op.between]: [minP, maxP] } }
      ];
    }

    // Sorting order
    let orderClause = [['durationDays', 'ASC']];
    if (sort === 'price-asc') {
      orderClause = [['pricePartialGuided', 'ASC'], ['price', 'ASC']];
    } else if (sort === 'price-desc') {
      orderClause = [['price', 'DESC'], ['pricePartialGuided', 'DESC']];
    } else if (sort === 'duration-asc') {
      orderClause = [['durationDays', 'ASC']];
    } else if (sort === 'duration-desc') {
      orderClause = [['durationDays', 'DESC']];
    } else if (sort === 'rating-desc') {
      orderClause = [['rating', 'DESC'], ['totalReviews', 'DESC']];
    } else {
      orderClause = [['isFeatured', 'DESC'], ['durationDays', 'ASC']];
    }

    const allTours = await Tour.findAll({
      where: whereClause,
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      order: orderClause
    });

    const destinations = await Destination.findAll({
      where: { navFeatured: true }
    });

    const totalActiveTours = await Tour.count({ where: { status: 'active' } });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' }
    ], process.env.APP_URL);

    res.render('pages/tours', {
      title: searchQuery ? `Vietnam Tours for "${searchQuery}" | Tranoi Travel` : 'Vietnam Tours & Tailor-Made Holidays | Tranoi Travel',
      metaTitle: 'Curated Vietnam Tours: Private & Partial-Guided | Tranoi Travel',
      metaDescription: 'Discover handcrafted Vietnam journeys with instant format toggle between Private Chauffeured and Partial-guided styles. Local specialists on the ground.',
      allTours,
      destinations,
      totalActiveTours,
      query: req.query,
      searchQuery,
      numberOfAdults,
      anytime,
      sort: sort || 'recommended',
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
    const cleanSlug = String(slug || '').trim().toLowerCase();

    // Friendly/navbar slug aliases mapping to canonical active tours
    const TOUR_SLUG_ALIASES = {
      'essential-north-vietnam-7-days': '7-days-north-vietnam-private',
      'classic-vietnam-explorer-10-days': '10-days-vietnam-highlights-private',
      'grand-vietnam-discovery-14-days': '14-days-north-to-south-partial-guided',
      'complete-vietnam-expedition-21-days': '21-days-vietnam-partial-guided',
      '7-days-north-vietnam': '7-days-north-vietnam-private',
      '10-days-vietnam-highlights': '10-days-vietnam-highlights-private',
      '14-days-north-to-south': '14-days-north-to-south-partial-guided',
      '21-days-vietnam': '21-days-vietnam-partial-guided',
      '7-days': '7-days-north-vietnam-private',
      '10-days': '10-days-vietnam-highlights-private',
      '14-days': '14-days-north-to-south-partial-guided',
      '21-days': '21-days-vietnam-partial-guided'
    };

    if (TOUR_SLUG_ALIASES[cleanSlug]) {
      return res.redirect(301, `/tours/${TOUR_SLUG_ALIASES[cleanSlug]}`);
    }

    const tour = await Tour.findOne({
      where: { slug: cleanSlug, status: 'active' },
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
