const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Theme = sequelize.define('Theme', {
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
  type: {
    type: DataTypes.STRING, // 'traveler-type' | 'source-market'
    defaultValue: 'traveler-type'
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'vietnam'
  },
  tagline: {
    type: DataTypes.STRING
  },
  heroImage: {
    type: DataTypes.STRING
  },
  body: {
    type: DataTypes.TEXT
  },
  relatedTourSlugs: {
    type: DataTypes.TEXT // JSON string array of tour slugs
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'themes'
});

module.exports = Theme;
