// client/src/pages/FAQ.jsx
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './FAQ.module.css';

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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  const subHeaderControls = useAnimation();
  const contentControls = useAnimation();
  const ctaControls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      subHeaderControls.start('visible');
      contentControls.start('visible');
      ctaControls.start('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, [subHeaderControls, contentControls, ctaControls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const faqItems = [
    {
      q: 'Что такое психологическая консультация?',
      a: 'Это поддерживающий диалог, направленный на понимание ваших чувств, мыслей и поведения. Я не ставлю диагнозов и не заменяю врача — я помогаю вам услышать себя и найти внутренний ресурс.'
    },
    {
      q: 'Как проходит первый сеанс?',
      a: 'Первый сеанс — диагностический. Мы обсудим ваш запрос, историю, ожидания. Я задам вопросы, чтобы понять контекст. Длится 60–90 минут. Вы можете говорить столько, сколько чувствуете нужным.'
    },
    {
      q: 'Сколько длится сеанс и как часто нужно приходить?',
      a: 'Сеанс длится 60 минут. Частота — индивидуально: от раз в неделю до раз в месяц. Мы подберём удобный ритм вместе.'
    },
    {
      q: 'Можно ли проходить консультации онлайн?',
      a: 'Да, я провожу сессии онлайн через защищённые платформы. Это удобно, если вы в другом городе или предпочитаете работать из дома.'
    },
    {
      q: 'Что делать, если я не знаю, с чего начать?',
      a: 'Это нормально. Многие приходят с чувством растерянности. Я помогу вам сформулировать запрос и создам безопасное пространство, где можно просто быть.'
    },
    {
      q: 'Гарантируете ли вы результат?',
      a: 'Я не обещаю чудес. Я обещаю — вы будете услышаны. Результат зависит от вашего участия, открытости и времени. Но каждый сеанс — шаг к себе.'
    }
  ];

  return (
    <div className={styles.container}>
      <RevealText
        text="Часто задаваемые вопросы"
        as="h1"
        className={styles.header}
        delay={100}
      />

      <motion.p
        initial="hidden"
        animate={subHeaderControls}
        variants={variants}
        className={styles.subheader}
      >
        Ниже — ответы на самые частые вопросы.  
        Если не нашли свой — <span className={styles.gradientText}>напишите мне</span>.
      </motion.p>

      <motion.div
        initial="hidden"
        animate={subHeaderControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.5, duration: 0.6 } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      <motion.div
        initial="hidden"
        animate={contentControls}
        variants={variants}
        className={styles.faqList}
      >
        {faqItems.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.q}</span>
              <span className={styles.accordionIcon}>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            <motion.div
              initial={false}
              animate={openIndex === index ? 'open' : 'closed'}
              variants={{
                open: { opacity: 1, height: 'auto', marginTop: '1rem' },
                closed: { opacity: 0, height: 0, marginTop: 0 }
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={styles.faqAnswer}
            >
              <p>{item.a}</p>
            </motion.div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate={contentControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.5, duration: 0.6 } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      <motion.div
        initial="hidden"
        animate={ctaControls}
        variants={variants}
        className={styles.cta}
      >
        <RevealText
          text="Остались вопросы?"
          as="h3"
          className={styles.ctaTitle}
          delay={600}
        />
        <p className={styles.ctaText}>
          Напишите — и я отвечу как можно скорее.
        </p>
        <button
          onClick={() => window.location.href = 'mailto:info@frolova.ru'}
          className={`${styles['gradient-button']} ${styles.faqButton}`}
        >
          <i className="pi pi-envelope"></i>
          Написать мне
        </button>
      </motion.div>
    </div>
  );
};

export default FAQ;
