const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

// Модель отзыва
const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  admin_reply: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  underscored: true
});

module.exports = Review;