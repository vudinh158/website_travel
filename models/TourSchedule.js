const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourSchedule = sequelize.define('TourSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tourId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATEONLY
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  priceOverride: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'open' // open, sold_out, cancelled
  }
}, {
  timestamps: true,
  tableName: 'tour_schedules'
});

module.exports = TourSchedule;
