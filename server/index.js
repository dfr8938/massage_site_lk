const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, connectDB } = require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение маршрутов
const authRoutes = require('./routes/auth');
const appointmentsRoutes = require('./routes/appointments');
const reviewsRoutes = require('./routes/reviews');
const statsRoutes = require('./routes/stats'); // Новый маршрут

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/stats', statsRoutes); // Подключаем статистику

// Сервировка статики (для продакшена)
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Синхронизация с БД и запуск сервера
const startServer = async () => {
  try {
    await connectDB(); // Подключение к PostgreSQL
    
    // Опционально: синхронизация моделей (только для разработки)
    // await sequelize.sync({ alter: true }); // Используйте с осторожностью в продакшене
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
      console.log(`📌 API доступно по /api/*`);
    });

    // Подключаем WebSocket к HTTP-серверу
    const { wss } = require('./utils/ws');
    wss.attach(server);

    console.log('🔌 WebSocket сервер запущен');
    
  } catch (error) {
    console.error('❌ Не удалось запустить сервер:', error.message);
    process.exit(1);
  }
};

startServer();
