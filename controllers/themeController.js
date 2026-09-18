const { Theme, Tour, Destination } = require('../models');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { formatCurrency, truncateText } = require('../helpers/formatters');
const { Op } = require('sequelize');

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

    const breadcrumbSchema = generateSchemaOrg.breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Themes', url: '/themes' },
      { name: theme.title, url: `/${theme.slug}` }
    ], process.env.APP_URL);

    res.render('pages/theme-detail', {
      title: `${theme.title} | Tranoi Travel`,
      metaTitle: theme.metaTitle || theme.title,
      metaDescription: theme.metaDescription || theme.tagline,
      theme,
      matchingTours,
      otherThemes,
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
