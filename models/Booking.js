const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true // Guest checkout support
  },
  tourId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scheduleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guestCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  guestDetails: {
    type: DataTypes.TEXT // JSON string of guest info array
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  couponCode: {
    type: DataTypes.STRING
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending, paid, failed, refunded
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'stripe' // stripe, credit_card, paypal
  },
  bookingStatus: {
    type: DataTypes.STRING,
    defaultValue: 'confirmed' // confirmed, pending, cancelled, completed
  },
  specialRequests: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'bookings'
});

module.exports = Booking;
