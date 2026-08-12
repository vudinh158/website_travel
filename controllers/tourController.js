const { Tour, Destination, Category, Review, TourSchedule, TourImage, User } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

/**
 * List Tours Directory Page
 */
const getTours = async (req, res, next) => {
  try {
    const { destination, category, search } = req.query;

    // Fetch Categories with their linked Tours
    const categorySilos = await Category.findAll({
      include: [
        {
          model: Tour,
          as: 'tours',
          where: { status: 'active' },
          required: false,
          include: [{ model: Destination, as: 'destination' }]
        }
      ]
    });

    // Fetch Destinations with their linked Tours
    const destinationSilos = await Destination.findAll({
      include: [
        {
          model: Tour,
          as: 'tours',
          where: { status: 'active' },
          required: false,
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });

    // All active tours for general query fallback
    let whereClause = { status: 'active' };
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { shortDescription: { [Op.like]: `%${search}%` } },
        { departureLocation: { [Op.like]: `%${search}%` } }
      ];
    }

    const allTours = await Tour.findAll({
      where: whereClause,
      include: [
        { model: Destination, as: 'destination' },
        { model: Category, as: 'category' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' }
    ], process.env.APP_URL);

    res.render('pages/tours', {
      title: 'Explore All Tour Packages & Categories | Tranoi Travel',
      metaTitle: 'Travel Tour Collections - Tranoi Travel',
      metaDescription: 'Browse curated tour packages within our specialty destinations with Tranoi Travel.',
      categorySilos,
      destinationSilos,
      allTours,
      query: req.query,
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
        message: 'The tour category travel cluster you are looking for could not be found.'
      });
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Tours', url: '/tours' },
      { name: category.name, url: `/tours/category/${category.slug}` }
    ], process.env.APP_URL);

    res.render('pages/tour-category-silo', {
      title: `${category.name} Tour Packages & Expeditions | Tranoi Travel`,
      metaTitle: `${category.name} Travel Category`,
      metaDescription: category.description || `Explore top-rated ${category.name} tour packages worldwide.`,
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
 * Single Tour Detail Controller
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

    // Related tours in same category or destination
    const relatedTours = await Tour.findAll({
      where: {
        id: { [Op.ne]: tour.id },
        destinationId: tour.destinationId,
        status: 'active'
      },
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
