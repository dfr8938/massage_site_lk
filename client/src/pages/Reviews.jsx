// client/src/pages/Reviews.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './Reviews.module.css';

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

const Reviews = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const headerControls = useAnimation();
  const statsControls = useAnimation();
  const divider1Controls = useAnimation();
  const reviewsControls = useAnimation();
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
        statsControls.start('visible');
        setTimeout(() => {
          divider1Controls.start('visible');
          setTimeout(() => {
            reviewsControls.start('visible');
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
  }, [headerControls, statsControls, divider1Controls, reviewsControls, divider2Controls, ctaControls]);

  // Анимации
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const reviewVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: 0.6 }
    })
  };

  const reviews = [
    {
      id: 1,
      name: 'Анна К.',
      text: 'После трёх сеансов пропала хроническая боль в пояснице.',
      rating: 5,
      date: '2025-04-15',
      dateAdded: '2025-04-16',
      approved: true
    },
    {
      id: 2,
      name: 'Дмитрий П.',
      text: 'Проходил курс спортивного массажа перед соревнованиями.',
      rating: 5,
      date: '2025-04-08',
      dateAdded: '2025-04-09',
      approved: true
    },
    {
      id: 3,
      name: 'Сергей В.',
      text: 'Хорошее расслабление, но хотел бы более интенсивного воздействия.',
      rating: 4,
      date: '2025-04-01',
      dateAdded: '2025-04-02',
      approved: true
    },
    {
      id: 4,
      name: 'Елена Т.',
      text: 'Очень тёплая атмосфера, чай с травами, спокойная музыка.',
      rating: 5,
      date: '2025-03-20',
      dateAdded: '2025-03-21',
      approved: true
    },
    {
      id: 5,
      name: 'Алексей М.',
      text: 'Массаж помог снять напряжение после офиса.',
      rating: 5,
      date: '2025-03-12',
      dateAdded: '2025-03-13',
      approved: true
    }
  ];

  const approvedReviews = reviews.filter(r => r.approved);
  const total = approvedReviews.length;

  const handleReviewClick = () => {
    navigate(userRole ? '/cabinet' : '/login');
  };

  const buttonLabel = userRole ? 'Перейти в кабинет' : 'Войти и оставить отзыв';

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
          text="Отзывы клиентов"
          as="h1"
          className={styles.header}
          delay={100}
        />
        <p className={styles.subheader}>
          Что говорят о моей работе — с душой и вниманием к каждому.
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

      {/* Статистика */}
      <motion.p
        initial="hidden"
        animate={statsControls}
        variants={variants}
        className={styles.stats}
      >
        Всего <strong>{total}</strong> {total === 1 ? 'отзыв' : total < 5 ? 'отзыва' : 'отзывов'}
      </motion.p>

      {/* Список отзывов */}
      <motion.div
        initial="hidden"
        animate={reviewsControls}
        variants={variants}
        className={styles.reviewsGrid}
      >
        {approvedReviews.length === 0 ? (
          <p className={styles.noReviews}>Пока нет отзывов</p>
        ) : (
          approvedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              custom={index}
              variants={reviewVariants}
              initial="hidden"
              animate="visible"
              className={styles.reviewCard}
            >
              <div className={styles.reviewHeader}>
                <strong>{review.name}</strong>
                <span className={styles.reviewDateSession}>
                  Приём: {new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </span>
              </div>
              <div className={styles.reviewDateAdded}>
                Добавлен: {new Date(review.dateAdded).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`pi ${i < review.rating ? 'pi-star-fill' : 'pi-star'}`}
                    style={{
                      color: i < review.rating ? '#d4a76a' : '#E0E0E0',
                      fontSize: '1.2rem'
                    }}
                  />
                ))}
              </div>
              <p className={styles.reviewText}>{review.text}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Линия перед CTA */}
      <motion.div
        initial="hidden"
        animate={reviewsControls}
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
          text="Хотите оставить отзыв?"
          as="h3"
          className={styles.ctaTitle}
          delay={600}
        />
        <Button
          label={buttonLabel}
          icon="pi pi-comments"
          onClick={handleReviewClick}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity={userRole ? 'success' : 'primary'}
        />
      </motion.div>
    </div>
  );
};

export default Reviews;
