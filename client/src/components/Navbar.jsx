import { Toolbar } from 'primereact/toolbar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import loginStyles from '../pages/Home.module.css'; // Для единообразия стилей с формами // ✅ Стили загружены

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole')); // ✅ Инициализация при монтировании
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: null,
    message: ''
  });
  const [errors, setErrors] = useState({});
  const menu = useRef(null);

  const navigateTo = (path) => () => navigate(path);
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Главная', icon: 'pi pi-home', path: '/', command: navigateTo('/') },
    { label: 'Услуги', icon: 'pi pi-briefcase', path: '/services', command: navigateTo('/services') },
    { label: 'Отзывы', icon: 'pi pi-comments', path: '/reviews', command: navigateTo('/reviews') },
    { label: 'Вопросы', icon: 'pi pi-question-circle', path: '/faq', command: navigateTo('/faq') },
    { label: 'Контакты', icon: 'pi pi-phone', path: '/contact', command: navigateTo('/contact') }
  ];

  const desktopNav = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      {menuItems.map((item) => {
        const active = isActive(item.path);
        return (
          <div
            key={item.path}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={item.command}
          >
            <i className={item.icon} style={{ fontSize: '1rem' }}></i>
            <span>{item.label}</span>
            {active && <span style={{ display: 'none' }} />}
          </div>
        );
      })}
    </div>
  );

  const menuButton = (
    <Button
      icon="pi pi-bars"
      text
      onClick={(e) => menu.current.toggle(e)}
      aria-haspopup
      aria-controls="overlay_menu"
      style={{ fontSize: '1.25rem' }}
      className="block md:hidden"
    />
  );

  const isHome = location.pathname === '/';

  const logo = (
    <img
      src="/images/logo.jpg"
      alt="Екатерина Фролова"
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        objectFit: 'cover',
        cursor: 'pointer',
        opacity: logoLoaded ? 1 : 0,
        transform: logoLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
      className={isHome ? styles.logoPulse : ''}
      onClick={navigateTo('/')}
      onLoad={() => setLogoLoaded(true)}
    />
  );

  const startContent = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      {logo}
      {menuButton}
      {isDesktop && desktopNav}
    </div>
  );

  const contactButton = (
    <Button
      label="Связаться"
      icon="pi pi-send"
      onClick={() => setVisible(true)}
      className={styles['contact-button']}
    />
  );

  const endContent = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }}>
      {contactButton}

      {userRole ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>
            Здравствуйте, {localStorage.getItem('userName') || 'Пользователь'}
          </span>
          {userRole === 'client' && (
            <Button label="Кабинет" icon="pi pi-user" text onClick={navigateTo('/cabinet')} />
          )}
          {userRole === 'admin' && (
            <Button label="Админ" icon="pi pi-cog" text onClick={navigateTo('/admin')} />
          )}
          {/* === КНОПКА "ВЫЙТИ" — КРАСНАЯ ИКОНКА И ТЕКСТ, СТИЛЬ КАК У "ВОЙТИ" === */}
          <button
            className={styles['gradient-button']}
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('userName');
              window.dispatchEvent(new Event('storage'));
              navigate('/');
            }}
            aria-label="Выйти из системы"
          >
            <i className="pi pi-sign-out" style={{ color: '#a0332c' }}></i>
            <span style={{ color: '#a0332c' }}>Выйти</span>
          </button>
        </div>
      ) : (
        <button
          className={styles['gradient-button']}
          onClick={navigateTo('/login')}
          aria-label="Войти в личный кабинет"
        >
          <i className="pi pi-sign-in"></i>
          <span>Войти</span>
        </button>
      )}
    </div>
  );

  useLayoutEffect(() => {
    const updateAuth = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };
    window.addEventListener('storage', updateAuth);
    updateAuth();
    return () => window.removeEventListener('storage', updateAuth);
  }, []); // ✅ Слушаем изменения localStorage

  useLayoutEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLogoLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'ФИО обязательно';
    if (!formData.phone.trim()) newErrors.phone = 'Телефон обязателен';
    if (!formData.email.trim()) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.subject) newErrors.subject = 'Выберите тему';
    if (!formData.message.trim()) newErrors.message = 'Сообщение обязательно';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Форма отправлена:', formData);
      alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
      setFormData({ fullName: '', phone: '', email: '', subject: null, message: '' });
      setVisible(false);
    }
  };

  const subjects = [
    { label: 'Запись на сеанс', value: 'booking' },
    { label: 'Вопрос по услугам', value: 'services' },
    { label: 'Отзыв или предложение', value: 'feedback' },
    { label: 'Сотрудничество', value: 'collab' },
    { label: 'Другое', value: 'other' }
  ];

  return (
    <>
      <Menu
        model={menuItems.map(item => ({
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className={item.icon}></i>
              {item.label}
            </span>
          ),
          command: item.command,
          className: isActive(item.path) ? 'font-bold text-primary' : ''
        }))}
        popup
        ref={menu}
        id="overlay_menu"
      />

      <Toolbar
        start={startContent}
        end={endContent}
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      />

      <Dialog
        visible={visible}
        style={{ width: '90vw', maxWidth: '520px' }}
        modal
        draggable={false}
        closable
        onHide={() => setVisible(false)}
        className={styles['dialog']}
        pt={{
          root: {
            style: {
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(90, 74, 66, 0.15)',
              border: '1px solid #eae4dd'
            }
          },
          header: {
            style: {
              background: '#f8f4f0',
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid #eae4dd'
            }
          },
          content: {
            style: { padding: '1.5rem' }
          },
          closeIcon: {
            style: { color: '#5a4a42' }
          }
        }}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a4a42', fontWeight: 500 }}>
            <i className="pi pi-comments" style={{ fontSize: '1.3rem' }}></i>
            <span>Напишите мне</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className={styles['contact-form']}>
          <div className="p-field mb-3">
            <label htmlFor="fullName" className="block font-medium mb-2">
              ФИО <span style={{ color: 'red' }}>*</span>
            </label>
            <InputText
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={errors.fullName ? 'p-invalid w-full' : 'w-full'}
              placeholder="Иванов Иван Иванович"
            />
            {errors.fullName && <small className="p-error">{errors.fullName}</small>}
          </div>

          <div className="p-field mb-3">
            <label htmlFor="phone" className="block font-medium mb-2">
              Телефон <span style={{ color: 'red' }}>*</span>
            </label>
            <InputText
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? 'p-invalid w-full' : 'w-full'}
              placeholder="+7 (916) 123-45-67"
            />
            {errors.phone && <small className="p-error">{errors.phone}</small>}
          </div>

          <div className="p-field mb-3">
            <label htmlFor="email" className="block font-medium mb-2">
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <InputText
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'p-invalid w-full' : 'w-full'}
              placeholder="example@domain.ru"
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div className="p-field mb-3">
            <label htmlFor="subject" className="block font-medium mb-2">
              Тема <span style={{ color: 'red' }}>*</span>
            </label>
            <Dropdown
              id="subject"
              value={formData.subject}
              options={subjects}
              onChange={(e) => setFormData({ ...formData, subject: e.value })}
              placeholder="Выберите тему"
              className={errors.subject ? 'p-invalid w-full' : 'w-full'}
              panelClassName={styles['dropdown-panel']}
            />
            {errors.subject && <small className="p-error">{errors.subject}</small>}
          </div>

          <div className="p-field mb-3">
            <label htmlFor="message" className="block font-medium mb-2">
              Сообщение <span style={{ color: 'red' }}>*</span>
            </label>
            <InputTextarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className={errors.message ? 'p-invalid w-full' : 'w-full'}
              placeholder="Опишите, как я могу вам помочь..."
            />
            {errors.message && <small className="p-error">{errors.message}</small>}
          </div>

          <div className="text-right mt-4">
            <Button
              type="submit"
              label="Отправить"
              icon="pi pi-check"
              className={`w-full mt-3 ${loginStyles['gradient-button']}`}
              style={{ padding: '0.9rem', fontSize: '1.1rem', fontWeight: 500 }}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Navbar;