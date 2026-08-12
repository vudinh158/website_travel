/**
 * Global Error Handling Middlewares
 */

const notFoundHandler = (req, res, next) => {
  res.status(404).render('pages/404', {
    title: '404 - Page Not Found | Tranoi Travel',
    metaTitle: 'Page Not Found',
    metaDescription: 'The page you are looking for does not exist.',
    message: 'Oops! The travel destination or page you are looking for could not be found.'
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(statusCode).json({
      success: false,
      message: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  res.status(statusCode).render('pages/404', {
    title: `${statusCode} Error | Tranoi Travel`,
    metaTitle: 'Server Error',
    metaDescription: 'An unexpected error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our server. Please try again later.'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
