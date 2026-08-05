const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogTag = sequelize.define('BlogTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'blog_tags'
});

module.exports = BlogTag;
