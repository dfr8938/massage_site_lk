// client/src/main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// PrimeReact: только один раз и в правильном порядке
import 'primereact/resources/primereact.min.css';           // Базовые стили PrimeReact
import 'primeicons/primeicons.css';                         // Иконки
import 'primeflex/primeflex.css';                           // Опционально: PrimeFlex (если используется)
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // ✅ Единая светлая тема

// Локальные стили — ДОЛЖНЫ БЫТЬ ПОСЛЕДНИМИ
import './index.css';

// Приложение
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
