const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SignatureExperience = sequelize.define('SignatureExperience', {
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
  subtitle: {
    type: DataTypes.STRING
  },
  heroImage: {
    type: DataTypes.STRING
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
  tableName: 'signature_experiences'
});

module.exports = SignatureExperience;
