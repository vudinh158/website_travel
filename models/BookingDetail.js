const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingDetail = sequelize.define('BookingDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  guestName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guestEmail: {
    type: DataTypes.STRING
  },
  guestPhone: {
    type: DataTypes.STRING
  },
  guestAge: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true,
  tableName: 'booking_details'
});

module.exports = BookingDetail;
