// client/src/pages/Contact.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './Contact.module.css';

// Универсальный компонент анимации букв — "волна"
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

// Заголовок с маской — как на Home
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

const Contact = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const headerControls = useAnimation();
  const bookingControls = useAnimation();
  const contactsControls = useAnimation();
  const mapControls = useAnimation();
  const footerTextControls = useAnimation();

  // Синхронизация авторизации
  useLayoutEffect(() => {
    const updateAuth = () => setUserRole(localStorage.getItem('userRole'));
    window.addEventListener('storage', updateAuth);
    updateAuth();
    return () => window.removeEventListener('storage', updateAuth);
  }, []);

  // Анимации
  useEffect(() => {
    const timer = setTimeout(() => {
      headerControls.start('visible');
      setTimeout(() => {
        bookingControls.start('visible');
        setTimeout(() => {
          contactsControls.start('visible');
          setTimeout(() => {
            mapControls.start('visible');
            setTimeout(() => {
              footerTextControls.start('visible');
            }, 200);
          }, 200);
        }, 200);
      }, 200);
    }, 100);
    return () => clearTimeout(timer);
  }, [headerControls, bookingControls, contactsControls, mapControls, footerTextControls]);

  // Анимации
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const handleBookingClick = () => {
    navigate(userRole ? '/cabinet' : '/login');
  };

  const buttonLabel = userRole ? 'Перейти в кабинет' : 'Войти и записаться';
  const buttonIcon = userRole ? 'pi pi-user' : 'pi pi-sign-in';
  const buttonSeverity = userRole ? 'success' : 'primary';

  return (
    <div className={styles.container}>
      {/* Заголовок и подзаголовок */}
      <motion.div
        initial="hidden"
        animate={headerControls}
        variants={variants}
        className={styles.headerBlock}
      >
        <RevealText
          text="Контактная информация"
          as="h1"
          className={styles.header}
          delay={100}
        />
        <p className={styles.subheader}>
          Буду рада ответить на ваши вопросы и записать на приём
        </p>
      </motion.div>

      {/* Линия после заголовка */}
      <motion.div
        initial="hidden"
        animate={headerControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Два столбца: Запись и Контакты */}
      <div className={styles.columns}>
        {/* Блок: Запись на приём */}
        <motion.div
          initial="hidden"
          animate={bookingControls}
          variants={variants}
          className={styles.column}
        >
          <RevealText
            text="Запись на приём"
            as="h3"
            className={styles.sectionTitle}
            delay={300}
          />

          <p>
            Запись осуществляется через{' '}
            <span className={styles.gradientText}>личный кабинет</span>.<br />
            После регистрации вы сможете выбрать удобную дату и время.
          </p>
          <p>
            <em>
              Не забудьте проверить статус вашей{' '}
              <span className={styles.gradientText}>записи</span> — подтверждение поступит 
              от администратора в течение 24 часов.
            </em>
          </p>

          <Button
            label={buttonLabel}
            icon={buttonIcon}
            onClick={handleBookingClick}
            className={`mt-3 px-5 py-2 ${styles['gradient-button']}`}
            severity={buttonSeverity}
          />
        </motion.div>

        {/* Блок: Контакты — с выравниванием и анимацией */}
        <motion.div
          initial="hidden"
          animate={contactsControls}
          variants={variants}
          className={styles.column}
        >
          <RevealText
            text="Контакты"
            as="h3"
            className={styles.sectionTitle}
            delay={400}
          />

          {/* Телефон */}
          <div className={styles.contactRow}>
            <motion.i
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 15 }}
              className={`pi pi-phone ${styles.contactIcon}`}
            ></motion.i>
            <motion.span
              className={styles.contactText}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.4 }}
            >
              <a href="tel:+79161234567" className={styles.link}>
                +7 (916) 123-45-67
              </a>
            </motion.span>
          </div>

          {/* Email */}
          <div className={styles.contactRow}>
            <motion.i
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 15 }}
              className={`pi pi-envelope ${styles.contactIcon}`}
            ></motion.i>
            <motion.span
              className={styles.contactText}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.4 }}
            >
              <a href="mailto:hello@frolova-massage.ru" className={styles.link}>
                hello@frolova-massage.ru
              </a>
            </motion.span>
          </div>

          {/* Адрес */}
          <div className={styles.contactRow}>
            <motion.i
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: 'spring', stiffness: 260, damping: 15 }}
              className={`pi pi-map-marker ${styles.contactIcon}`}
            ></motion.i>
            <motion.span
              className={styles.contactText}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15, duration: 0.4 }}
            >
              г. Москва, ул. Ленина, д. 123, офис 45
            </motion.span>
          </div>

          {/* Часы работы */}
          <div className={styles.contactRow}>
            <motion.i
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 15 }}
              className={`pi pi-clock ${styles.contactIcon}`}
            ></motion.i>
            <motion.div
              className={styles.contactText}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.35, duration: 0.4 }}
            >
              <div className={styles.scheduleGrid}>
                <span className={styles.day}>Пн–Пт</span>
                <span className={`${styles.time} ${styles.timeBold}`}>9:00–20:00</span>

                <span className={styles.day}>Сб</span>
                <span className={`${styles.time} ${styles.timeBold}`}>10:00–18:00</span>

                <span className={styles.day}>Вс</span>
                <span className={`${styles.time} ${styles.gradientText}`}>выходной</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Линия перед картой */}
      <motion.div
        initial="hidden"
        animate={contactsControls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Карта — с плавным фокусом */}
      <motion.div
        initial="hidden"
        animate={mapControls}
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.8,
              ease: 'easeOut'
            }
          }
        }}
        className={styles.mapContainer}
      >
        <iframe
          title="Местоположение массажного кабинета"
          width="100%"
          height="400"
          frameBorder="0"
          style={{ border: 0, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Екатерина+Фролова,+массажный+кабинет,+Москва"
          allowFullScreen
        ></iframe>
      </motion.div>

      {/* Финальный текст */}
      <motion.p
        initial="hidden"
        animate={footerTextControls}
        variants={variants}
        className={styles.footerText}
      >
        Приходите — здесь вы найдёте покой, заботу и восстановление
      </motion.p>
    </div>
  );
};

export default Contact;
