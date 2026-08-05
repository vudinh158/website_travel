# WanderLust Tours - Travel Tour Booking Website

A modern, production-ready, SEO-optimized **Travel Tour Booking Website** built with Node.js, Express.js, EJS, Bootstrap 5, PostgreSQL / Sequelize ORM, JWT, Passport.js, Stripe, Nodemailer, and Docker.

---

## Features & Highlights

- **MVC Architecture**: Clean separation of Controllers, Models, Views, Routes, Services, and Middlewares.
- **Tour Booking System**: Date selector, guest count calculator, live coupon application, order summary, and Stripe checkout.
- **Search & Filter**: Search autocomplete, destination filter, category filter, price range slider, duration selector, minimum rating filter, and sorting.
- **User Features**: Authentication (JWT, bcrypt, session), User Dashboard, Profile management, Password updates, Saved Wishlist, Booking history, and Cancellation.
- **Admin Dashboard**: Revenue analytics, total bookings counter, popular tours/destinations ranking, Tour CRUD, Booking status updates, Customer directory, Review moderation, Coupon management, Contact submissions, and System settings.
- **Blog System**: Categories, tags, travel guides, views counter, related articles.
- **SEO & Performance**: Dynamic OpenGraph, Twitter Cards, Schema.org JSON-LD (`TouristTrip`, `BreadcrumbList`, `Organization`, `FAQPage`, `BlogPosting`), dynamic `/sitemap.xml`, and `/robots.txt`.
- **Security & Reliability**: Helmet headers, CSRF protection, rate limiting, password hashing with bcrypt, input validation.

---

## Tech Stack

- **Frontend**: HTML5, CSS3, ES6+ JavaScript, Bootstrap 5, Bootstrap Icons, EJS, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL / Sequelize ORM (with SQLite fallback for instant zero-config local run).
- **Authentication**: JWT, bcryptjs, Passport.js.
- **Integrations**: Stripe Payment Gateway, Nodemailer, Multer, Cloudinary, Docker.

---

## Quick Start (Local Run)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Database Seed**:
   ```bash
   npm run db:seed
   ```

3. **Start the Application**:
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

4. Open browser at `http://localhost:3000`.

---

## Demo Login Credentials

- **Admin Account**:
  - Email: `admin@wanderlust.com`
  - Password: `admin123`
  - URL: `http://localhost:3000/admin`

- **Customer Account**:
  - Email: `customer@wanderlust.com`
  - Password: `user123`
  - URL: `http://localhost:3000/login`

- **Promotional Coupons**:
  - `WELCOME10` (10% Off)
  - `SUMMER100` ($100 Off)

---

## Docker Deployment

To run the complete stack (Node.js App, PostgreSQL, Redis) via Docker Compose:

```bash
docker-compose up -d --build
```

---

## Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

DB_DIALECT=sqlite
DB_STORAGE=database/travel_tour.sqlite

JWT_SECRET=travel_tour_super_secret_jwt_key_2026
SESSION_SECRET=travel_tour_session_secret_key_2026
STRIPE_PUBLISHABLE_KEY=pk_test_sample
STRIPE_SECRET_KEY=sk_test_sample
```
