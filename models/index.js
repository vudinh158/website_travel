const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Destination = require('./Destination');
const Category = require('./Category');
const Tour = require('./Tour');
const TourSchedule = require('./TourSchedule');
const TourImage = require('./TourImage');
const Booking = require('./Booking');
const BookingDetail = require('./BookingDetail');
const Payment = require('./Payment');
const Coupon = require('./Coupon');
const Review = require('./Review');
const BlogCategory = require('./BlogCategory');
const Blog = require('./Blog');
const Tag = require('./Tag');
const BlogTag = require('./BlogTag');
const Contact = require('./Contact');
const NewsletterSubscriber = require('./NewsletterSubscriber');
const Wishlist = require('./Wishlist');
const Setting = require('./Setting');

// User & Role
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Destination & Tour
Destination.hasMany(Tour, { foreignKey: 'destinationId', as: 'tours' });
Tour.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

// Category & Tour
Category.hasMany(Tour, { foreignKey: 'categoryId', as: 'tours' });
Tour.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Tour & TourSchedule
Tour.hasMany(TourSchedule, { foreignKey: 'tourId', as: 'schedules' });
TourSchedule.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

// Tour & TourImage
Tour.hasMany(TourImage, { foreignKey: 'tourId', as: 'images' });
TourImage.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

// User & Booking
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Tour & Booking
Tour.hasMany(Booking, { foreignKey: 'tourId', as: 'bookings' });
Booking.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

// TourSchedule & Booking
TourSchedule.hasMany(Booking, { foreignKey: 'scheduleId', as: 'bookings' });
Booking.belongsTo(TourSchedule, { foreignKey: 'scheduleId', as: 'schedule' });

// Booking & BookingDetail
Booking.hasMany(BookingDetail, { foreignKey: 'bookingId', as: 'details' });
BookingDetail.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Booking & Payment
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Tour & Review
Tour.hasMany(Review, { foreignKey: 'tourId', as: 'reviews' });
Review.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

// User & Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// BlogCategory & Blog
BlogCategory.hasMany(Blog, { foreignKey: 'categoryId', as: 'blogs' });
Blog.belongsTo(BlogCategory, { foreignKey: 'categoryId', as: 'category' });

// User (Author) & Blog
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Blog & Tag (Many-to-Many)
Blog.belongsToMany(Tag, { through: BlogTag, foreignKey: 'blogId', as: 'tags' });
Tag.belongsToMany(Blog, { through: BlogTag, foreignKey: 'tagId', as: 'blogs' });

// User & Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tour.hasMany(Wishlist, { foreignKey: 'tourId', as: 'wishlists' });
Wishlist.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

module.exports = {
  sequelize,
  Role,
  User,
  Destination,
  Category,
  Tour,
  TourSchedule,
  TourImage,
  Booking,
  BookingDetail,
  Payment,
  Coupon,
  Review,
  BlogCategory,
  Blog,
  Tag,
  BlogTag,
  Contact,
  NewsletterSubscriber,
  Wishlist,
  Setting
};
