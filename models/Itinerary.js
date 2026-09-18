const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Itinerary = sequelize.define('Itinerary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  duration: {
    type: DataTypes.INTEGER, // 7, 10, 14, 21 days
    allowNull: false
  },
  heroImage: {
    type: DataTypes.STRING
  },
  summary: {
    type: DataTypes.TEXT
  },
  routeIdeas: {
    type: DataTypes.TEXT // JSON string array of { title, summary, relatedTourSlug }
  },
  body: {
    type: DataTypes.TEXT
  },
  relatedDestinations: {
    type: DataTypes.TEXT // JSON string array of destination slugs
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'itineraries'
});

module.exports = Itinerary;
