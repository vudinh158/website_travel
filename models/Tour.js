const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  destinationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  },
  featuredImage: {
    type: DataTypes.STRING
  },
  gallery: {
    type: DataTypes.TEXT // JSON string array of image URLs
  },
  shortDescription: {
    type: DataTypes.TEXT
  },
  fullDescription: {
    type: DataTypes.TEXT
  },
  highlights: {
    type: DataTypes.TEXT // JSON string array
  },
  duration: {
    type: DataTypes.STRING // e.g. "5 Days / 4 Nights"
  },
  durationDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  departureLocation: {
    type: DataTypes.STRING
  },
  transportation: {
    type: DataTypes.STRING // e.g. "Flight & Speedboat"
  },
  schedule: {
    type: DataTypes.TEXT // e.g. "Daily / Every Monday"
  },
  itinerary: {
    type: DataTypes.TEXT // JSON string array of day-by-day objects [{ day: 1, title: '...', description: '...' }]
  },
  includedServices: {
    type: DataTypes.TEXT // JSON string array
  },
  excludedServices: {
    type: DataTypes.TEXT // JSON string array
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  meetingPoint: {
    type: DataTypes.STRING
  },
  googleMapsEmbed: {
    type: DataTypes.TEXT
  },
  cancellationPolicy: {
    type: DataTypes.TEXT
  },
  faqs: {
    type: DataTypes.TEXT // JSON string array of { question, answer }
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  tableName: 'tours'
});

module.exports = Tour;
