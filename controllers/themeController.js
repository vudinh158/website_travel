const { Theme, Tour, Destination, Guide, Itinerary } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

// Mapping curated travel guides & route stories to themes per sitemap guidelines
const themeRelatedArticlesMap = {
  'honeymoon': {
    guideSlugs: ['best-time-to-visit-vietnam', 'private-tours-vs-partial-guided'],
    itinerarySlugs: ['10-days-vietnam-highlights-route']
  },
  'family': {
    guideSlugs: ['how-many-days-in-vietnam', 'vietnam-travel-tips', 'getting-around-vietnam'],
    itinerarySlugs: []
  },
  'adventure': {
    guideSlugs: ['getting-around-vietnam', 'best-time-to-visit-vietnam'],
    itinerarySlugs: ['14-days-north-to-south-grand-route']
  },
  'culinary': {
    guideSlugs: ['vietnam-travel-tips', 'best-time-to-visit-vietnam'],
    itinerarySlugs: ['7-days-essential-vietnam-route']
  },
  'eco-tours': {
    guideSlugs: ['private-tours-vs-partial-guided', 'best-time-to-visit-vietnam'],
    itinerarySlugs: ['21-days-in-depth-vietnam-expedition']
  },
  'veterans-tours': {
    guideSlugs: ['getting-around-vietnam', 'vietnam-travel-tips', 'private-tours-vs-partial-guided'],
    itinerarySlugs: []
  },
  'educational-tours': {
    guideSlugs: ['how-many-days-in-vietnam', 'vietnam-visa-guide', 'vietnam-travel-tips'],
    itinerarySlugs: []
  },
  'vietnam-tours-from-usa': {
    guideSlugs: ['vietnam-visa-guide', 'how-many-days-in-vietnam'],
    itinerarySlugs: ['14-days-north-to-south-grand-route']
  },
  'vietnam-tours-from-australia': {
    guideSlugs: ['best-time-to-visit-vietnam', 'vietnam-visa-guide'],
    itinerarySlugs: ['10-days-vietnam-highlights-route']
  },
  'vietnam-tours-from-uae': {
    guideSlugs: ['best-time-to-visit-vietnam', 'private-tours-vs-partial-guided', 'vietnam-travel-tips'],
    itinerarySlugs: []
  }
};

/**
 * Themes Hub (/themes)
 */
const getThemes = async (req, res, next) => {
  try {
    const travelerThemes = await Theme.findAll({
      where: { type: 'traveler-type' }
    });

    const marketThemes = await Theme.findAll({
      where: { type: 'source-market' }
    });

    const schemaOrg = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Themes', url: '/themes' }
    ], process.env.APP_URL);

    res.render('pages/themes-hub', {
      title: 'Vietnam Tour Themes & Travel Styles | Tranoi Travel',
      metaTitle: 'Curated Vietnam Travel Themes and Styles',
      metaDescription: 'Explore our hand-crafted travel themes: honeymoon, family, culinary, adventure, and regional source markets.',
      travelerThemes,
      marketThemes,
      schemaOrg,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Flat Theme Detail Handler (/{theme-slug})
 */
const getThemeBySlug = async (req, res, next) => {
  try {
    const { themeSlug } = req.params;

    // Exclude reserved routes from flat matching
    const reservedSlugs = [
      'admin', 'api', 'auth', 'dashboard', 'login', 'register', 'logout',
      'tours', 'destinations', 'vietnam', 'trips', 'guides', 'experiences',
      'customer-stories', 'trip-reviews', 'themes', 'about', 'about-us',
      'how-it-works', 'meet-the-team', 'responsible-travel', 'loyalty-program',
      'contact', 'faq', 'terms', 'terms-conditions', 'privacy', 'privacy-policy',
      'thank-you', 'checkout', 'booking-success', 'booking-failed', 'css', 'js', 'images'
    ];

    if (reservedSlugs.includes(themeSlug.toLowerCase())) {
      return next();
    }

    const theme = await Theme.findOne({
      where: { slug: themeSlug }
    });

    if (!theme) {
      return next(); // Not a theme route, let it pass to 404 or next route
    }

    // Parse related tour slugs and fetch matching tours
    let matchingTours = [];
    if (theme.relatedTourSlugs) {
      try {
        const slugs = typeof theme.relatedTourSlugs === 'string' ? JSON.parse(theme.relatedTourSlugs) : theme.relatedTourSlugs;
        matchingTours = await Tour.findAll({
          where: {
            slug: { [Op.in]: slugs },
            status: 'active'
          },
          include: [{ model: Destination, as: 'destination' }]
        });
      } catch (e) {
        matchingTours = [];
      }
    }

    // If no specific slugs matched, fetch fallback tours
    if (matchingTours.length === 0) {
      matchingTours = await Tour.findAll({
        where: { status: 'active' },
        include: [{ model: Destination, as: 'destination' }],
        limit: 3
      });
    }

    const otherThemes = await Theme.findAll({
      where: { id: { [Op.ne]: theme.id } },
      limit: 3
    });

    // Fetch Related Blogs / Travel Guides / Route Stories for this Theme
    const mapping = themeRelatedArticlesMap[theme.slug] || {
      guideSlugs: ['best-time-to-visit-vietnam', 'private-tours-vs-partial-guided', 'vietnam-travel-tips'],
      itinerarySlugs: []
    };

    let relatedArticles = [];
    try {
      if (mapping.guideSlugs && mapping.guideSlugs.length > 0) {
        const guides = await Guide.findAll({
          where: { slug: { [Op.in]: mapping.guideSlugs } }
        });
        guides.forEach(g => {
          relatedArticles.push({
            id: `guide-${g.id}`,
            title: g.title,
            category: g.category || 'Travel Guide',
            typeBadge: 'Travel Guide',
            badgeClass: 'bg-primary',
            slug: g.slug,
            url: `/guides/${g.slug}`,
            image: g.heroImage || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
            readTime: g.readTime || '6 min read',
            excerpt: g.excerpt || (g.body ? truncateText(g.body.replace(/<[^>]*>/g, ''), 120) : 'Essential insights and tips.')
          });
        });
      }

      if (mapping.itinerarySlugs && mapping.itinerarySlugs.length > 0) {
        const itineraries = await Itinerary.findAll({
          where: { slug: { [Op.in]: mapping.itinerarySlugs } }
        });
        itineraries.forEach(it => {
          relatedArticles.push({
            id: `itinerary-${it.id}`,
            title: it.title,
            category: `${it.duration} Days Route Idea`,
            typeBadge: 'Route Story',
            badgeClass: 'bg-accent',
            slug: it.slug,
            url: `/trips/${it.slug}`,
            image: it.heroImage || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
            readTime: `${it.duration} Days Inspiration`,
            excerpt: it.body ? truncateText(it.body.replace(/<[^>]*>/g, ''), 120) : 'Curated pacing and day-by-day highlights.'
          });
        });
      }

      if (relatedArticles.length === 0) {
        const fallbackGuides = await Guide.findAll({ limit: 3, order: [['createdAt', 'DESC']] });
        fallbackGuides.forEach(g => {
          relatedArticles.push({
            id: `guide-${g.id}`,
            title: g.title,
            category: g.category || 'Travel Guide',
            typeBadge: 'Travel Guide',
            badgeClass: 'bg-primary',
            slug: g.slug,
            url: `/guides/${g.slug}`,
            image: g.heroImage,
            readTime: g.readTime || '5 min read',
            excerpt: g.excerpt
          });
        });
      }
    } catch (e) {
      console.error('Error fetching theme related articles:', e);
      relatedArticles = [];
    }

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: theme.title, url: `/${theme.slug}` }
    ], process.env.APP_URL);

    res.render('pages/theme-detail', {
      title: `${theme.title} | Tranoi Travel`,
      metaTitle: theme.metaTitle || theme.title,
      metaDescription: theme.metaDescription || theme.tagline,
      theme,
      matchingTours,
      otherThemes,
      relatedArticles,
      schemaOrg: breadcrumbSchema,
      formatCurrency,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getThemes,
  getThemeBySlug
};
