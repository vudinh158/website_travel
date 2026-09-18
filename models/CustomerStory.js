const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerStory = sequelize.define('CustomerStory', {
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
  travelerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  travelerLocation: {
    type: DataTypes.STRING,
    defaultValue: 'United States'
  },
  tourSlug: {
    type: DataTypes.STRING
  },
  tourTitle: {
    type: DataTypes.STRING
  },
  tripDate: {
    type: DataTypes.STRING
  },
  formatTaken: {
    type: DataTypes.STRING, // 'private' | 'partial-guided'
    defaultValue: 'partial-guided'
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  travelerQuote: {
    type: DataTypes.TEXT
  },
  heroImage: {
    type: DataTypes.STRING
  },
  gallery: {
    type: DataTypes.TEXT // JSON string array of photos
  },
  body: {
    type: DataTypes.TEXT
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'customer_stories'
});

module.exports = CustomerStory;
