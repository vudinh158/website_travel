const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guide = sequelize.define('Guide', {
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
  category: {
    type: DataTypes.STRING, // e.g. 'Planning & Essentials', 'Culture & Practical Tips'
    defaultValue: 'Travel Guide'
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'vietnam'
  },
  heroImage: {
    type: DataTypes.STRING
  },
  readTime: {
    type: DataTypes.STRING,
    defaultValue: '6 min read'
  },
  excerpt: {
    type: DataTypes.TEXT
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
  tableName: 'guides'
});

module.exports = Guide;
