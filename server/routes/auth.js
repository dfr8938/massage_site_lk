const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Регистрация
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Валидация
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ message: 'Некорректный email' });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^7?9\d{9}$/.test(phoneDigits) || phoneDigits.length !== 10) {
      return res.status(400).json({ message: 'Некорректный телефон' });
    }

    // Проверка существования
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Пользователь с таким телефоном уже существует' });
    }

    // Создание
    const user = await User.create({
      name,
      email,
      phone,
      password // Хеширование в хуке
    });

    res.status(201).json({
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { loginBy, email, phone, password } = req.body;

  try {
    if ((loginBy === 'email' && !email) || (loginBy === 'phone' && !phone)) {
      return res.status(400).json({ message: 'Введите email или телефон' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Введите пароль' });
    }

    const where = loginBy === 'email' ? { email } : { phone };
    const user = await User.findOne({ where });

    if (!user) {
      return res.status(401).json({ message: 'Неверные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверные данные' });
    }

    // Генерация JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Вход выполнен',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;