const { Destination, Tour, Category } = require('../models');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { generateSchemaOrg } = require('../helpers/seoHelper');

/**
 * List All Destinations
 */
const getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll({
      include: [{ model: Tour, as: 'tours', where: { status: 'active' }, required: false }]
    });

    res.render('pages/destinations', {
      title: 'Top Travel Destinations Worldwide | Tranoi Travel',
      metaTitle: 'Explore Specialty Travel Destinations - Tranoi Travel',
      metaDescription: 'Browse curated travel destinations and specialty tours with Tranoi Travel.',
      destinations,
      formatCurrency,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Destination Detail Page
 */
const getDestinationDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const destination = await Destination.findOne({
      where: { slug },
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

    if (!destination) {
      return res.status(404).render('pages/404', {
        title: 'Destination Not Found',
        metaTitle: 'Destination Not Found',
        metaDescription: 'The requested destination is unavailable.',
        message: 'Could not find the requested travel destination.'
      });
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Destinations', url: '/destinations' },
      { name: destination.name, url: `/destinations/${destination.slug}` }
    ], process.env.APP_URL);

    res.render('pages/destination-detail', {
      title: `${destination.name} Travel Guide & Tours | Tranoi Travel`,
      metaTitle: destination.metaTitle || `${destination.name} Guide`,
      metaDescription: destination.metaDescription || destination.description,
      destination,
      schemaOrg: breadcrumbSchema,
      formatCurrency,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDestinations,
  getDestinationDetail
};
