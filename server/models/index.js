const User = require('./User');
const Appointment = require('./Appointment');
const Review = require('./Review');
const { sequelize } = require('../utils/db');

// Связь: пользователь -> записи
User.hasMany(Appointment, { foreignKey: 'client_id' });
Appointment.belongsTo(User, { foreignKey: 'client_id' });

// Связь: пользователь -> отзывы
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// Экспорт моделей
module.exports = {
  User,
  Appointment,
  Review,
  sequelize
};