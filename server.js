const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

dotenv.config();

const { sequelize, User } = require('./models');
const seedDatabase = require('./database/seed');
const { attachUser } = require('./middleware/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance Middlewares
app.use(cors());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled CSP to allow external CDNs & maps embeds smoothly
    crossOriginResourcePolicy: false
  })
);

// Body Parsers & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET || 'travel_tour_session_secret_key_2026'));

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'travel_tour_session_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

// View Engine & Layout Setup
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// User Attachment Middleware
app.use(attachUser);

// Layout Selection Middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) {
    app.set('layout', 'layouts/admin');
  } else {
    app.set('layout', 'layouts/main');
  }
  next();
});

// App Routes
app.use('/', routes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Database Connection & Server Listener
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    await sequelize.sync();
    
    // Auto Seed if database has no users
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Running initial seeders...');
      await seedDatabase();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Tranoi Travel Booking Website running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
}

startServer();
