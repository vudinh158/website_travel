const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discountType: {
    type: DataTypes.STRING,
    defaultValue: 'percentage' // percentage or fixed
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  minBookingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'coupons'
});

module.exports = Coupon;
