const express = require('express');
const router = express.Router();
const { Appointment, User } = require('../models');
const authenticateToken = require('../middleware/auth'); // Предполагаем, что есть middleware

// Создание записи
router.post('/', authenticateToken, async (req, res) => {
  const { client_id, service, date, time, notes } = req.body;

  try {
    if (!client_id || !service || !date || !time) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }

    // Проверка существования клиента
    const user = await User.findByPk(client_id);
    if (!user) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    const appointment = await Appointment.create({
      client_id,
      service,
      date,
      time,
      notes
    });

    res.status(201).json({ message: 'Запись создана', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании записи' });
  }
});

// Получение записей клиента
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  const { clientId } = req.params;

  try {
    const appointments = await Appointment.findAll({
      where: { client_id: clientId },
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении записей' });
  }
});

// Получение всех записей (для админки)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'phone']
      }],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении записей' });
  }
});

// Обновление статуса записи
router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: 'Статус обязателен' });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Статус обновлён', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса' });
  }
});

// Удаление записи
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    await appointment.destroy();
    res.json({ message: 'Запись удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении записи' });
  }
});

module.exports = router;