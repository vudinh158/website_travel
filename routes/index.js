const express = require('express');
const router = express.Router();
const webRoutes = require('./webRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const apiRoutes = require('./apiRoutes');
const { Tour, Destination, Blog } = require('../models');

// SEO Sitemap Generator
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const tours = await Tour.findAll({ where: { status: 'active' }, attributes: ['slug', 'updatedAt'] });
    const destinations = await Destination.findAll({ attributes: ['slug', 'updatedAt'] });
    const blogs = await Blog.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticPages = ['', '/tours', '/destinations', '/blog', '/about', '/contact', '/faq', '/privacy', '/terms'];
    staticPages.forEach(page => {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    tours.forEach(tour => {
      xml += `  <url>\n    <loc>${baseUrl}/tours/${tour.slug}</loc>\n    <lastmod>${tour.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    destinations.forEach(dest => {
      xml += `  <url>\n    <loc>${baseUrl}/destinations/${dest.slug}</loc>\n    <lastmod>${dest.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    blogs.forEach(blog => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${blog.slug}</loc>\n    <lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).end();
  }
});

// robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\nSitemap: ${baseUrl}/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// Sub-routers
router.use('/', authRoutes);
router.use('/', webRoutes);
router.use('/', userRoutes);
router.use('/admin', adminRoutes);
router.use('/api', apiRoutes);

module.exports = router;
