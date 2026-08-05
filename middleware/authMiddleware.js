const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

/**
 * Middleware to attach user object to req and res.locals for EJS views
 */
const attachUser = async (req, res, next) => {
  res.locals.user = null;
  res.locals.isAuthenticated = false;
  res.locals.isAdmin = false;
  res.locals.currentPath = req.path;

  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_tour_super_secret_jwt_key_2026');
      const user = await User.findByPk(decoded.id, {
        include: [{ model: Role, as: 'role' }]
      });

      if (user && user.isActive) {
        req.user = user;
        res.locals.user = user;
        res.locals.isAuthenticated = true;
        res.locals.isAdmin = user.roleId === 1 || (user.role && user.role.name === 'admin');
      }
    } catch (err) {
      // Clear invalid token
      res.clearCookie('token');
    }
  }

  next();
};

/**
 * Require authentication for protected routes
 */
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
  }

  req.session.returnTo = req.originalUrl;
  return res.redirect('/login?error=' + encodeURIComponent('Please login to access this page.'));
};

/**
 * Require Admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.roleId === 1 || (req.user.role && req.user.role.name === 'admin'))) {
    return next();
  }

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
  }

  return res.status(403).render('pages/404', {
    title: '403 Forbidden - WanderLust',
    message: 'Access Denied: You need Administrator privileges to view this page.'
  });
};

module.exports = {
  attachUser,
  isAuthenticated,
  isAdmin
};
