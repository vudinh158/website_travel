const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'stripe'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'succeeded' // succeeded, pending, failed
  },
  paymentDetails: {
    type: DataTypes.TEXT // JSON details string
  }
}, {
  timestamps: true,
  tableName: 'payments'
});

module.exports = Payment;
