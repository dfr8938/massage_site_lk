// client/src/pages/TermsOfService.jsx
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import styles from './PolicyPage.module.css';

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

const TermsOfService = () => {
  const navigate = useNavigate();
  const subHeaderControls = useAnimation();
  const contentControls = useAnimation();
  const featuresControls = useAnimation();
  const ctaControls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      subHeaderControls.start('visible');
      contentControls.start('visible');
      featuresControls.start('visible');
      ctaControls.start('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, [subHeaderControls, contentControls, featuresControls, ctaControls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className={styles.container}>
      <RevealText
        text="Условия использования"
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
        Использование сайта и услуг означает принятие этих условий.  
        Мы строим отношения на <span className={styles.gradientText}>честности, уважении и профессионализме</span>.
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
        className={styles.silenceBlock}
      >
        <p>Здесь вы в безопасности.<br />Без неожиданностей. Без обмана.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={contentControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.6, duration: 0.6 } }
        }}
        className={styles.dividerBlock}
      ></motion.div>

      <motion.div
        initial="hidden"
        animate={featuresControls}
        variants={variants}
        className={styles.featuresGrid}
      >
        <div>
          <RevealText
            text="1. Предмет"
            as="h3"
            className={styles.featureTitle}
            delay={200}
          />
          <p>Настоящие Условия регулируют использование сайта <strong>frolova.ru</strong> и получение услуг: консультаций, сессий, обратной связи.</p>
        </div>

        <div>
          <RevealText
            text="2. Регистрация"
            as="h3"
            className={styles.featureTitle}
            delay={400}
          />
          <p>Для записи требуется:</p>
          <ul className={styles.featureList}>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Заполнение формы на сайте</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Подтверждение согласия с Условиями</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Оплата сеанса (если применимо)</span>
            </motion.li>
          </ul>
        </div>
      </motion.div>

      <div className={styles.featuresGrid}>
        <div>
          <RevealText
            text="3. Ответственность"
            as="h3"
            className={styles.featureTitle}
            delay={600}
          />
          <p>Я, Екатерина Фролова:</p>
          <ul className={styles.featureList}>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Не ставлю медицинских диагнозов</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Не заменяю врачебную помощь</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Работаю в рамках психологической поддержки</span>
            </li>
          </ul>
        </div>

        <div>
          <RevealText
            text="4. Оплата и отмена"
            as="h3"
            className={styles.featureTitle}
            delay={800}
          />
          <p>Сеанс считается подтверждённым после оплаты.</p>
          <ul className={styles.featureList}>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Отмена менее чем за 12 часов — не возвращается</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Перенос возможен при уведомлении заранее</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Возврат при форс-мажоре с моей стороны</span>
            </li>
          </ul>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate={featuresControls}
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
          text="Готовы начать?"
          as="h3"
          className={styles.ctaTitle}
          delay={1000}
        />
        <p className={styles.ctaText}>
          Запишитесь — и сделайте первый шаг к себе.
        </p>
        <Button
          label="Записаться"
          icon="pi pi-calendar-plus"
          onClick={() => navigate('/contact')}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity="success"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={ctaControls}
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
        className={styles.quote}
      >
        <p className={styles['quote-gradient']}>
          «Я не обещаю чудес. Я обещаю — вы будете услышаны.»
        </p>
        <p className={styles.quoteAuthor}>
          — Екатерина Фролова
        </p>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
