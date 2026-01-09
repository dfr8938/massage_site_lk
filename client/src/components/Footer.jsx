// client/src/components/Footer.jsx
import { Button } from 'primereact/button';
import styles from './Footer.module.css'; // ✅ Стили загружены

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#faf9f8',
        borderTop: '1px solid #e8e5e0',
        color: '#666',
        padding: '2.5rem 1rem',
        fontSize: '0.9rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div
        className="flex flex-column md:flex-row justify-content-between align-items-center"
        style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}
      >
        {/* © Текст */}
        <div className="text-center md:text-left">
          <p className="m-0" style={{ color: '#5a4a42', fontWeight: '500' }}>
            © {new Date().getFullYear()} Екатерина Фролова. Все права защищены.
          </p>
        </div>

        {/* Контакты */}
        <div className="flex flex-column align-items-center">
          <div className="flex align-items-center gap-3 text-center">
            <i className="pi pi-phone" style={{ color: '#5a4a42', fontSize: '1rem' }}></i>
            <span style={{ color: '#5a4a42' }}>+7 (999) 123-45-67</span>
          </div>
          <div className="flex align-items-center gap-3 mt-1 text-center">
            <i className="pi pi-envelope" style={{ color: '#5a4a42', fontSize: '1rem' }}></i>
            <span style={{ color: '#5a4a42' }}>info@frolova.ru</span>
          </div>
        </div>

        {/* Соцсети */}
        <div className="flex gap-3">
          <Button
            icon="pi pi-instagram"
            rounded
            text
            aria-label="Instagram"
            title="Instagram"
            onClick={() => window.open('https://instagram.com', '_blank')}
            pt={{
              root: {
                style: {
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  color: '#5a4a42'
                }
              }
            }}
            className={styles['social-button']}
          />
          <Button
            icon="pi pi-telegram"
            rounded
            text
            aria-label="Telegram"
            title="Telegram"
            onClick={() => window.open('https://t.me', '_blank')}
            pt={{
              root: {
                style: {
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  color: '#5a4a42'
                }
              }
            }}
            className={styles['social-button']}
          />
          <Button
            icon="pi pi-whatsapp"
            rounded
            text
            aria-label="WhatsApp"
            title="WhatsApp"
            onClick={() => window.open('https://wa.me/79991234567', '_blank')}
            pt={{
              root: {
                style: {
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  color: '#5a4a42'
                }
              }
            }}
            className={styles['social-button']}
          />
        </div>
      </div>

      {/* Тёплая разделительная линия */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #d4a76a20, transparent)',
          margin: '2rem auto 1.5rem',
          width: '90%',
          maxWidth: '1200px'
        }}
      ></div>

      {/* Политика и условия */}
      <div className="flex justify-content-center gap-4">
        <a
          href="/privacy"
          className={styles['footer-link']}
          style={{ fontSize: '0.85rem' }}
        >
          Политика конфиденциальности
        </a>
        <span style={{ color: '#ccc', userSelect: 'none' }}>•</span>
        <a
          href="/terms"
          className={styles['footer-link']}
          style={{ fontSize: '0.85rem' }}
        >
          Условия использования
        </a>
      </div>
    </footer>
  );
};

export default Footer;
