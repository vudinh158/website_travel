const { Destination, Tour, Category } = require('../models');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { Op } = require('sequelize');

/**
 * Vietnam Destinations Hub (/vietnam and /destinations)
 * Lists all 17 Vietnam destinations grouped by region (North, Central, South)
 */
const getDestinations = async (req, res, next) => {
  try {
    const allDestinations = await Destination.findAll({
      order: [
        ['priority', 'ASC'], // P0 first, then P1, P2
        ['name', 'ASC']
      ],
      include: [{ model: Tour, as: 'tours', where: { status: 'active' }, required: false }]
    });

    const p0Destinations = allDestinations.filter(d => d.priority === 'P0');
    const northDestinations = allDestinations.filter(d => d.region === 'north');
    const centralDestinations = allDestinations.filter(d => d.region === 'central');
    const southDestinations = allDestinations.filter(d => d.region === 'south');

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Vietnam Destinations', url: '/vietnam' }
    ], process.env.APP_URL);

    res.render('pages/vietnam-hub', {
      title: 'Vietnam Travel Destinations: North, Central & South | Tranoi Travel',
      metaTitle: 'All 17 Vietnam Travel Destinations | Tranoi Travel',
      metaDescription: 'Explore all Vietnam travel destinations across North, Central, and South. From Hanoi and Ha Long Bay to Hoi An, Saigon, and tropical islands.',
      allDestinations,
      p0Destinations,
      northDestinations,
      centralDestinations,
      southDestinations,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Destination Detail Page (/vietnam/:slug and /destinations/:slug)
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
          required: false
        }
      ]
    });

    if (!destination) {
      return res.status(404).render('pages/404', {
        title: 'Destination Not Found',
        metaTitle: 'Destination Not Found',
        metaDescription: 'The requested destination is unavailable.',
        message: 'Could not find the requested travel destination in Vietnam.'
      });
    }

    // Fetch related destinations
    let relatedDestList = [];
    if (destination.relatedDestinations) {
      try {
        const slugs = typeof destination.relatedDestinations === 'string' ? JSON.parse(destination.relatedDestinations) : destination.relatedDestinations;
        relatedDestList = await Destination.findAll({
          where: { slug: { [Op.in]: slugs } }
        });
      } catch (e) {
        relatedDestList = [];
      }
    }

    // If relatedDestList is empty, fetch other destinations in same region
    if (relatedDestList.length === 0) {
      relatedDestList = await Destination.findAll({
        where: {
          region: destination.region,
          id: { [Op.ne]: destination.id }
        },
        limit: 3
      });
    }

    // Parse attractions and gallery
    let attractions = [];
    if (destination.attractions) {
      try {
        attractions = typeof destination.attractions === 'string' ? JSON.parse(destination.attractions) : destination.attractions;
      } catch (e) {
        attractions = [];
      }
    }

    let gallery = [];
    if (destination.gallery) {
      try {
        gallery = typeof destination.gallery === 'string' ? JSON.parse(destination.gallery) : destination.gallery;
      } catch (e) {
        gallery = [];
      }
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Vietnam', url: '/vietnam' },
      { name: destination.name, url: `/vietnam/${destination.slug}` }
    ], process.env.APP_URL);

    res.render('pages/destination-detail', {
      title: `${destination.name} Travel Guide & Curated Tours | Tranoi Travel`,
      metaTitle: destination.metaTitle || `${destination.name} Travel Guide`,
      metaDescription: destination.metaDescription || destination.description,
      destination,
      attractions,
      gallery,
      relatedDestList,
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
