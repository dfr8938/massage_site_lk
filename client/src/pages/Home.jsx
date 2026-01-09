// client/src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './Home.module.css'; // ✅ Стили загружены

// Универсальный компонент анимации букв
const AnimatedText = ({ text, className = '', delay = 0, as: Tag = 'span' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Tag className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`${styles.letter} ${visible ? styles.animate : ''}`}
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

// Заголовок с маской
const RevealText = ({ text, as: Tag = 'h1', className = '', delay = 0 }) => {
  return (
    <Tag className={className}>
      <span
        className={styles['title-reveal']}
        data-text={text}
      >
        <AnimatedText text={text} delay={delay} as="span" />
      </span>
    </Tag>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  // Следим за авторизацией
  useLayoutEffect(() => {
    const updateAuth = () => setUserRole(localStorage.getItem('userRole'));
    window.addEventListener('storage', updateAuth);
    updateAuth();
    return () => window.removeEventListener('storage', updateAuth);
  }, []);

  const handleButtonClick = () => {
    navigate(userRole ? '/cabinet' : '/login');
  };

  const buttonLabel = userRole ? 'Перейти в кабинет' : 'Войти и записаться';
  const buttonSeverity = userRole ? 'success' : 'primary';

  // Анимации
  const subHeaderControls = useAnimation();
  const contentControls = useAnimation();
  const featuresControls = useAnimation();
  const ctaControls = useAnimation();
  const quoteControls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      subHeaderControls.start('visible');
      contentControls.start('visible');
      featuresControls.start('visible');
      ctaControls.start('visible');
      quoteControls.start('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, [subHeaderControls, contentControls, featuresControls, ctaControls, quoteControls]);

  // Анимации
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <RevealText
        text="Привет! Я — Екатерина"
        as="h1"
        className={styles.header}
        delay={100}
      />

      {/* Подзаголовок */}
      <motion.p
        initial="hidden"
        animate={subHeaderControls}
        variants={variants}
        className={styles.subheader}
      >
        Помогу вам снять напряжение, которое годами накапливалось в теле.  
        Массаж у меня — не просто техника, а{' '}
        <span className={styles.gradientText}>
          забота, внимание и дыхание нового дня
        </span>.
      </motion.p>

      {/* Линия 1: после подзаголовка */}
      <motion.div
        initial="hidden"
        animate={subHeaderControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Блок: Тишина */}
      <motion.div
        initial="hidden"
        animate={contentControls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }
        }}
        className={styles.silenceBlock}
      >
        <p>
          Здесь вы можете просто быть.<br />
          Без объяснений. Без суеты. Без масок.
        </p>
      </motion.div>

      {/* Линия 2: после "Тишина" */}
      <motion.div
        initial="hidden"
        animate={contentControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.7, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Блоки: О мастере и Почему выбирают меня */}
      <motion.div
        initial="hidden"
        animate={featuresControls}
        variants={variants}
        className={styles.featuresGrid}
      >
        {/* Блок "О мастере" */}
        <div>
          <RevealText
            text="О мастере"
            as="h3"
            className={styles.featureTitle}
            delay={200}
          />
          <p>
            Меня зовут{' '}
            <span className={styles.gradientTextBold}>Екатерина Фролова</span> — сертифицированный массажист с 8-летним опытом.
            Специализируюсь на{' '}
            <span className={styles.gradientTextBold}>
              лечебном, спортивном и классическом массаже
            </span>.
          </p>
          <p>
            Моя цель — помочь вам снять напряжение, улучшить самочувствие и вернуть радость движения.
          </p>
        </div>

        {/* Блок "Почему выбирают меня?" */}
        <div>
          <RevealText
            text="Почему выбирают меня?"
            as="h3"
            className={styles.featureTitle}
            delay={400}
          />
          <ul className={styles.featureList}>
            {[
              'Индивидуальный подход к каждому клиенту',
              'Использование проверенных техник',
              'Уютный кабинет в центре Москвы',
              'Гибкое время посещений'
            ].map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className={styles.checkItem}
              >
                <i className={`pi pi-check ${styles.checkmark}`}></i>
                <span className={styles.featureText}>{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Линия 3: после особенностей */}
      <motion.div
        initial="hidden"
        animate={featuresControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Призыв к действию */}
      <motion.div
        initial="hidden"
        animate={ctaControls}
        variants={variants}
        className={styles.cta}
      >
        <RevealText
          text="Готовы почувствовать лёгкость?"
          as="h3"
          className={styles.ctaTitle}
          delay={600}
        />
        <p className={styles.ctaText}>
          Запишитесь на приём — и почувствуйте разницу уже после первого сеанса.
        </p>
        <Button
          label={buttonLabel}
          icon="pi pi-calendar-plus"
          onClick={handleButtonClick}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity={buttonSeverity}
        />
      </motion.div>

      {/* Линия 4: после CTA */}
      <motion.div
        initial="hidden"
        animate={ctaControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Цитата — без рамки сверху */}
      <motion.div
        initial="hidden"
        animate={quoteControls}
        variants={variants}
        className={styles.quote}
      >
        <p className={styles['quote-gradient']}>
          «Когда клиент выходит с сеанса с лёгкой улыбкой и говорит: 
          “Я не чувствовал себя так хорошо годами” — 
          для меня нет ничего важнее.»
        </p>
        <p className={styles.quoteAuthor}>
          — Екатерина Фролова
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
