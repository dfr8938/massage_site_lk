// client/src/pages/Services.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './Services.module.css';

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

const Services = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const headerControls = useAnimation();
  const subheaderControls = useAnimation();
  const divider1Controls = useAnimation();
  const servicesControls = useAnimation();
  const divider2Controls = useAnimation();
  const ctaControls = useAnimation();

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
        subheaderControls.start('visible');
        setTimeout(() => {
          divider1Controls.start('visible');
          setTimeout(() => {
            servicesControls.start('visible');
            setTimeout(() => {
              divider2Controls.start('visible');
              setTimeout(() => {
                ctaControls.start('visible');
              }, 500);
            }, 100);
          }, 500);
        }, 200);
      }, 200);
    }, 100);
    return () => clearTimeout(timer);
  }, [headerControls, subheaderControls, divider1Controls, servicesControls, divider2Controls, ctaControls]);

  // Анимации
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: 0.6 }
    })
  };

  const services = [
    { id: 1, name: 'Классический массаж', price: '2500 ₽', duration: '60 мин', description: 'Универсальный массаж для расслабления мышц и снятия напряжения.', active: true },
    { id: 2, name: 'Спортивный массаж', price: '3000 ₽', duration: '75 мин', description: 'Ориентирован на восстановление после физических нагрузок и профилактику травм.', active: true },
    { id: 3, name: 'Лечебный массаж', price: '3200 ₽', duration: '90 мин', description: 'Направлен на лечение заболеваний опорно-двигательного аппарата.', active: false },
    { id: 4, name: 'Антицеллюлитный массаж', price: '2800 ₽', duration: '60 мин', description: 'Специальный массаж для коррекции контуров тела и борьбы с целлюлитом.', active: true },
    { id: 5, name: 'Массаж головы и шеи', price: '1500 ₽', duration: '30 мин', description: 'Быстрое снятие напряжения, головной боли и усталости.', active: true }
  ];

  const activeServices = services.filter(s => s.active);

  const handleBookingClick = () => {
    navigate(userRole ? '/cabinet' : '/login');
  };

  const buttonLabel = userRole ? 'Перейти в кабинет' : 'Войти и записаться';
  const buttonSeverity = userRole ? 'success' : 'primary';

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <motion.div
        initial="hidden"
        animate={headerControls}
        variants={variants}
        className={styles.headerBlock}
      >
        <RevealText
          text="Наши услуги"
          as="h1"
          className={styles.header}
          delay={100}
        />
      </motion.div>

      {/* Подзаголовок */}
      <motion.p
        initial="hidden"
        animate={subheaderControls}
        variants={variants}
        className={styles.subheader}
      >
        Качественный массаж для здоровья и расслабления — с душой и вниманием к телу.
      </motion.p>

      {/* Линия 1: после заголовка */}
      <motion.div
        initial="hidden"
        animate={divider1Controls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      {/* Сетка услуг */}
      <motion.div
        initial="hidden"
        animate={servicesControls}
        variants={variants}
        className={styles.servicesGrid}
      >
        {activeServices.length === 0 ? (
          <p className={styles.noServices}>В данный момент услуги недоступны</p>
        ) : (
          activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={serviceVariants}
              initial="hidden"
              animate="visible"
              className={styles.serviceCard}
            >
              <RevealText
                text={service.name}
                as="h3"
                className={styles.serviceTitle}
                delay={300 + index * 100}
              />
              <div className={styles.dividerThin}></div>
              <div className={styles.serviceMeta}>
                <span className={styles.price}>{service.price}</span>
                <span className={styles.duration}>{service.duration}</span>
              </div>
              <p className={styles.description}>{service.description}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Линия 2: перед CTA */}
      <motion.div
        initial="hidden"
        animate={divider2Controls}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } }
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
          text="Готовы начать?"
          as="h3"
          className={styles.ctaTitle}
          delay={500}
        />
        <p className={styles.ctaText}>
          Выберите удобное время и запишитесь на приём уже сегодня.
        </p>
        <Button
          label={buttonLabel}
          icon="pi pi-calendar-plus"
          onClick={handleBookingClick}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity={buttonSeverity}
        />
      </motion.div>
    </div>
  );
};

export default Services;
