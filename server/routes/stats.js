const express = require('express');
const router = express.Router();
const { Appointment, sequelize } = require('../models');
const authenticateToken = require('../middleware/auth');

// Получение статистики записей по дням
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const stats = await Appointment.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
      raw: true
    });

    res.json({ stats });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;