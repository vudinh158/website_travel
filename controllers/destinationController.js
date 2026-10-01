const { Destination, Tour, Category, Guide, Review, User } = require('../models');
const { formatCurrency, formatDate, truncateText } = require('../helpers/formatters');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { getDestinationFaqs } = require('../helpers/destinationFaqHelper');
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

    // Ensure exactly at most 3 related destinations are passed
    relatedDestList = relatedDestList.slice(0, 3);

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

    // Fetch Travel Essentials guides for this destination:
    // Query logic:
    // 1. Destination-specific guides (guide.relatedDestinations contains destination.slug)
    // 2. Universal guides (guide.relatedDestinations is empty/null/[])
    // 3. Cap at 1 to 3 cards, prioritizing destination-specific matches over universal ones
    let travelEssentials = [];
    try {
      const allGuides = await Guide.findAll({
        order: [['createdAt', 'DESC']]
      });

      const specificGuides = [];
      const universalGuides = [];

      allGuides.forEach(guide => {
        let related = [];
        if (guide.relatedDestinations) {
          try {
            related = typeof guide.relatedDestinations === 'string'
              ? JSON.parse(guide.relatedDestinations)
              : guide.relatedDestinations;
            if (!Array.isArray(related)) {
              related = [String(related)];
            }
          } catch (e) {
            related = String(guide.relatedDestinations).split(',').map(s => s.trim().toLowerCase());
          }
        }

        const relatedSlugs = related.map(s => String(s).toLowerCase().trim()).filter(Boolean);

        if (relatedSlugs.length === 0) {
          universalGuides.push(guide);
        } else if (
          relatedSlugs.includes(destination.slug.toLowerCase()) ||
          relatedSlugs.includes(destination.name.toLowerCase())
        ) {
          guide.isDestinationSpecific = true;
          specificGuides.push(guide);
        }
      });

      // Prioritize destination-specific matches first, followed by universal fallback guides, capped at 6 cards
      travelEssentials = [...specificGuides, ...universalGuides].slice(0, 6);
    } catch (e) {
      travelEssentials = [];
    }

    // Fetch destination-specific FAQs (non-generic, genuine traveler Q&A)
    const destinationFaqs = getDestinationFaqs(destination, relatedDestList);

    // Combine breadcrumb and FAQPage schema for search engine rich snippets
    let pageSchema = breadcrumbSchema;
    if (destinationFaqs && destinationFaqs.length > 0) {
      const faqSchema = generateSchemaOrg.faq(destinationFaqs);
      if (faqSchema) {
        pageSchema = `${breadcrumbSchema}\n${faqSchema}`;
      }
    }

    // Fetch Traveler Reviews derived from tours passing through this destination:
    // A review is linked to a tour (Review.tourId), and tours have destinations they pass through.
    // Query: Find all tours passing through destination X -> Get approved reviews of those tours.
    let travelerReviews = [];
    try {
      const allActiveTours = await Tour.findAll({
        where: { status: 'active' }
      });

      const destNameLower = destination.name.toLowerCase();
      const destSlugLower = destination.slug.toLowerCase();

      const matchingTours = allActiveTours.filter(tour => {
        if (tour.destinationId === destination.id) return true;
        const stops = tour.destinations || [];
        return stops.some(stop => {
          const s = String(stop).toLowerCase().trim();
          return s === destNameLower || s === destSlugLower;
        });
      });

      // Update destination.tours to include all tours passing through this destination
      if (matchingTours.length > 0) {
        destination.tours = matchingTours;
      }

      const matchingTourIds = matchingTours.map(t => t.id);

      if (matchingTourIds.length > 0) {
        travelerReviews = await Review.findAll({
          where: {
            tourId: { [Op.in]: matchingTourIds },
            status: 'approved'
          },
          include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'address'] },
            { model: Tour, as: 'tour', attributes: ['id', 'name', 'slug', 'duration', 'formats'] }
          ],
          order: [['createdAt', 'DESC']],
          limit: 12
        });
      }
    } catch (e) {
      console.error('Error fetching derived traveler reviews for destination:', e);
      travelerReviews = [];
    }

    res.render('pages/destination-detail', {
      title: `${destination.name} Travel Guide & Curated Tours | Tranoi Travel`,
      metaTitle: destination.metaTitle || `${destination.name} Travel Guide`,
      metaDescription: destination.metaDescription || destination.description,
      destination,
      attractions,
      gallery,
      relatedDestList,
      travelEssentials,
      destinationFaqs,
      travelerReviews,
      schemaOrg: pageSchema,
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
