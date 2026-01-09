const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

// Модель записи
const Appointment = sequelize.define('Appointment', {
  service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'confirmed', 'cancelled', 'completed']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  underscored: true
});

module.exports = Appointment;