const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  description: {
    type: DataTypes.TEXT
  },
  banner: {
    type: DataTypes.STRING
  },
  gallery: {
    type: DataTypes.TEXT // JSON string of images array
  },
  attractions: {
    type: DataTypes.TEXT // JSON string of key attractions array
  },
  travelGuide: {
    type: DataTypes.TEXT
  },
  weatherInfo: {
    type: DataTypes.TEXT // JSON string weather info
  },
  country: {
    type: DataTypes.STRING
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'destinations'
});

module.exports = Destination;
