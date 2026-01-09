// client/src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './Home.module.css'; // Используем тот же стиль, что и на главной

// === Анимированный текст по буквам === //
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
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

// === Текст с эффектом "раскрытия маской" === //
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

const NotFound = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const ctaControls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start('visible');
      ctaControls.start('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, [controls, ctaControls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className={styles.container} style={{ textAlign: 'center', paddingTop: '4rem' }}>
      {/* Заголовок с маской */}
      <RevealText
        text="Страница не найдена"
        as="h1"
        className={styles.header}
        delay={100}
      />

      <motion.p
        initial="hidden"
        animate={controls}
        variants={variants}
        className={styles.subheader}
      >
        Похоже, вы зашли туда, куда ещё не ступала моя мысль.  
        Но это не беда — давайте вернёмся <span className={styles.gradientText}>туда, где тепло</span>.
      </motion.p>

      {/* Линия с каплей */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.5, duration: 0.6 } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Блок "Тишина" */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className={styles.silenceBlock}
      >
        <p>
          Здесь можно просто быть.<br />
          Даже если вы «заблудились».
        </p>
      </motion.div>

      {/* Линия */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.6, duration: 0.6 } }
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
          text="Где я?"
          as="h3"
          className={styles.ctaTitle}
          delay={400}
        />
        <p className={styles.ctaText}>
          Вы находитесь вне карты. Но дом — всегда рядом.
        </p>
        <Button
          label="Вернуться на главную"
          icon="pi pi-home"
          onClick={() => navigate('/')}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity="primary"
        />
      </motion.div>

      {/* Линия */}
      <motion.div
        initial="hidden"
        animate={ctaControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.5, duration: 0.6 } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Цитата внизу */}
      <motion.div
        initial="hidden"
        animate={ctaControls}
        variants={variants}
        className={styles.quote}
      >
        <p className={styles['quote-gradient']}>
          «Иногда самый важный путь — это не вперёд, а назад, к себе.»
        </p>
        <p className={styles.quoteAuthor}>
          — Екатерина Фролова
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
