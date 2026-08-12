const { Blog, BlogCategory, Tag, User } = require('../models');
const { formatDate, truncateText } = require('../helpers/formatters');
const { generateSchemaOrg } = require('../helpers/seoHelper');
const { Op } = require('sequelize');

/**
 * List Blogs Page
 */
const getBlogs = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let whereClause = { isPublished: true };
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } }
      ];
    }

    let includeClause = [
      { model: BlogCategory, as: 'category' },
      { model: User, as: 'author', attributes: ['name', 'avatar'] },
      { model: Tag, as: 'tags' }
    ];

    if (category) {
      const catObj = await BlogCategory.findOne({ where: { slug: category } });
      if (catObj) whereClause.categoryId = catObj.id;
    }

    const blogs = await Blog.findAll({
      where: whereClause,
      include: includeClause,
      order: [['createdAt', 'DESC']]
    });

    const categories = await BlogCategory.findAll();
    const tags = await Tag.findAll();

    res.render('pages/blog', {
      title: 'Travel Blog & Inspiration | Tranoi Travel',
      metaTitle: 'Travel Blog - Expert Guides & Destination Insights',
      metaDescription: 'Read our latest travel guides and destination insights from Tranoi Travel.',
      blogs,
      categories,
      tags,
      query: req.query,
      formatDate,
      truncateText
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Blog Detail Page
 */
const getBlogDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      where: { slug, isPublished: true },
      include: [
        { model: BlogCategory, as: 'category' },
        { model: User, as: 'author', attributes: ['name', 'avatar', 'bio'] },
        { model: Tag, as: 'tags' }
      ]
    });

    if (!blog) {
      return res.status(404).render('pages/404', {
        title: 'Article Not Found',
        metaTitle: 'Article Not Found',
        metaDescription: 'The blog article could not be found.',
        message: 'The requested travel article does not exist or has been removed.'
      });
    }

    // Increment views count
    blog.viewsCount += 1;
    await blog.save();

    const relatedBlogs = await Blog.findAll({
      where: {
        id: { [Op.ne]: blog.id },
        categoryId: blog.categoryId,
        isPublished: true
      },
      limit: 3
    });

    const schemaOrg = generateSchemaOrg.blogPosting(blog, process.env.APP_URL);

    res.render('pages/blog-detail', {
      title: `${blog.title} | Tranoi Travel Blog`,
      metaTitle: blog.metaTitle || blog.title,
      metaDescription: blog.metaDescription || blog.excerpt,
      blog,
      relatedBlogs,
      schemaOrg,
      formatDate
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogDetail
};
