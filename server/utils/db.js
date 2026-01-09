const { Sequelize } = require('sequelize');
require('dotenv').config();

// Настройка подключения к PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'massage_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Тест подключения
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к PostgreSQL установлено');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
