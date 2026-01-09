// client/src/components/Preloader.jsx
import { useState, useEffect } from 'react';
import styles from './Preloader.module.css'; // ✅ Стили загружены

const Preloader = () => {
  const texts = [
    'Добро пожаловать...',
    'Создаём пространство...',
    'Слушаю вас...',
    'Здесь безопасно...',
    'Вы в центре...'
  ];

  const [currentText, setCurrentText] = useState(texts[0]);

  useEffect(() => {
    // Выбираем случайный текст, не повторяя предыдущий
    const randomText = () => {
      let next;
      do {
        next = texts[Math.floor(Math.random() * texts.length)];
      } while (next === currentText && texts.length > 1);
      return next;
    };

    const interval = setInterval(() => {
      setCurrentText(randomText());
    }, 2300);

    return () => clearInterval(interval);
  }, [currentText]);

  return (
    <div className={styles.preloader}>
      <div className={styles.logoContainer}>
        <img
          src="/images/logo.jpg"
          alt="Екатерина Фролова"
          className={styles.logo}
        />
        <div className={styles.spinner}></div>
      </div>

      <p className={styles.randomText}>{currentText}</p>
    </div>
  );
};

export default Preloader;
