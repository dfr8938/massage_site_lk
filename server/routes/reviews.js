const express = require('express');
const router = express.Router();
const { Review, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// Создание отзыва
router.post('/', authenticateToken, async (req, res) => {
  const { user_id, rating, text } = req.body;

  try {
    if (!user_id || !rating || !text) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' });
    }

    // Проверка существования пользователя
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const review = await Review.create({
      user_id,
      rating,
      text
    });

    res.status(201).json({ message: 'Отзыв отправлен на модерацию', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании отзыва' });
  }
});

// Получение отзывов пользователя
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении отзывов' });
  }
});

// Получение всех отзывов (для админки) с фильтрацией
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { approved } = req.query;

    const where = {};
    if (approved !== undefined) {
      where.is_approved = approved === 'true';
    }

    const reviews = await Review.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении отзывов' });
  }
});

// Одобрение отзыва
router.patch('/:id/approve', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    review.is_approved = true;
    await review.save();

    res.json({ message: 'Отзыв одобрен', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при одобрении отзыва' });
  }
});

// Ответ на отзыв
router.patch('/:id/reply', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    if (!reply) {
      return res.status(400).json({ message: 'Текст ответа обязателен' });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    review.admin_reply = reply;
    await review.save();

    res.json({ message: 'Ответ отправлен', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при отправке ответа' });
  }
});

// Удаление отзыва
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    await review.destroy();
    res.json({ message: 'Отзыв удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении отзыва' });
  }
});

module.exports = router;