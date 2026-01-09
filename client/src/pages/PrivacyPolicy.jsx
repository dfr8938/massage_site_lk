// client/src/pages/PrivacyPolicy.jsx
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

const PrivacyPolicy = () => {
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
        text="Политика конфиденциальности"
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
        Настоящая Политика регулирует обработку персональных данных пользователями сайта.  
        Я, Екатерина Фролова, действую в соответствии с <span className={styles.gradientText}>ФЗ-152 «О персональных данных»</span>.
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
        <p>Доверие — основа работы.<br />Конфиденциальность — обязательство.</p>
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
            text="1. Определения"
            as="h3"
            className={styles.featureTitle}
            delay={200}
          />
          <p><strong>Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно определённому физическому лицу.</p>
          <p><strong>Оператор</strong> — Екатерина Фролова, ИП, ОГРНИП 322770000000000, ИНН 000000000000.</p>
        </div>

        <div>
          <RevealText
            text="2. Сбор данных"
            as="h3"
            className={styles.featureTitle}
            delay={400}
          />
          <ul className={styles.featureList}>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>ФИО, email, телефон — при записи на консультацию</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>IP-адрес, тип браузера — для анализа посещаемости (анонимно)</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Данные сессии — сохраняются только в зашифрованном виде</span>
            </motion.li>
          </ul>
        </div>
      </motion.div>

      <div className={styles.featuresGrid}>
        <div>
          <RevealText
            text="3. Цели обработки"
            as="h3"
            className={styles.featureTitle}
            delay={600}
          />
          <p>Персональные данные обрабатываются исключительно для:</p>
          <ul className={styles.featureList}>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Организации и проведения консультаций</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Обратной связи и напоминаний</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Улучшения качества услуг и сайта</span>
            </li>
          </ul>
        </div>

        <div>
          <RevealText
            text="4. Права субъекта"
            as="h3"
            className={styles.featureTitle}
            delay={800}
          />
          <p>Вы вправе в любое время:</p>
          <ul className={styles.featureList}>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Запросить копию своих данных</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Исправить неточности</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Требовать удаления</span>
            </li>
            <li className={styles.checkItem}>
              <i className={`pi pi-check ${styles.checkmark}`}></i>
              <span className={styles.featureText}>Отозвать согласие</span>
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
          text="Обратная связь"
          as="h3"
          className={styles.ctaTitle}
          delay={1000}
        />
        <p className={styles.ctaText}>
          Для реализации своих прав направьте запрос по адресу.
        </p>
        <Button
          label="Написать"
          icon="pi pi-envelope"
          onClick={() => window.location.href = 'mailto:info@frolova.ru'}
          className={`px-6 py-3 ${styles['gradient-button']}`}
          severity="primary"
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
          «Я не передаю, не продаю и не делаю публичными ваши данные. Это не просто правило — это уважение.»
        </p>
        <p className={styles.quoteAuthor}>
          — Екатерина Фролова
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
