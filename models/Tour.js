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
  formats: {
    type: DataTypes.TEXT, // JSON string array e.g. ["private", "partial-guided"]
    defaultValue: JSON.stringify(["private", "partial-guided"])
  },
  region: {
    type: DataTypes.STRING, // north, central, south, multi-region
    defaultValue: 'multi-region'
  },
  theme: {
    type: DataTypes.TEXT // JSON string array of theme slugs e.g. ["family", "culinary"]
  },
  sourceMarket: {
    type: DataTypes.TEXT // JSON string array of market slugs e.g. ["vietnam-tours-from-usa"]
  },
  pace: {
    type: DataTypes.STRING, // Relaxed, Moderate, Active
    defaultValue: 'Moderate'
  },
  groupSize: {
    type: DataTypes.STRING, // e.g. "Private: 2-8 guests | Partial-guided: max 12"
    defaultValue: 'Private (2-8 guests) or Small Group (max 12)'
  },
  duration: {
    type: DataTypes.STRING // e.g. "10 Days / 9 Nights"
  },
  durationDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  departureLocation: {
    type: DataTypes.STRING
  },
  transportation: {
    type: DataTypes.STRING // e.g. "Private chauffeured AC vehicle & domestic flights"
  },
  schedule: {
    type: DataTypes.TEXT // e.g. "Daily Departures Guaranteed"
  },
  itinerary: {
    type: DataTypes.TEXT // JSON string array of day-by-day objects [{ day: 1, title: '...', description: '...', image: '...' }]
  },
  routeMapPoints: {
    type: DataTypes.TEXT // JSON string array of stops for Vietnam map [{ name: 'Hanoi', lat: 21.0285, lng: 105.8542 }]
  },
  includedServices: {
    type: DataTypes.TEXT // Generic fallback JSON string array
  },
  excludedServices: {
    type: DataTypes.TEXT // Generic fallback JSON string array
  },
  includedPrivate: {
    type: DataTypes.TEXT // JSON string array of inclusions specific to Private format
  },
  includedPartialGuided: {
    type: DataTypes.TEXT // JSON string array of inclusions specific to Partial-guided format
  },
  excludedPrivate: {
    type: DataTypes.TEXT // JSON string array
  },
  excludedPartialGuided: {
    type: DataTypes.TEXT // JSON string array
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  pricePrivate: {
    type: DataTypes.DECIMAL(10, 2)
  },
  pricePartialGuided: {
    type: DataTypes.DECIMAL(10, 2)
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
