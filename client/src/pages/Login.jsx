// client/src/pages/Login.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { useIMask } from 'react-imask';
import styles from '../pages/Home.module.css'; // ✅ Стили переиспользуются

// Валидация
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return /^7?9\d{9}$/.test(digits) && digits.length === 10;
};
const formatPhoneForStorage = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `+7${digits}` : '';
};

// Правила сложности пароля
const passwordRules = [
  { label: 'Не менее 8 символов', validate: (pw) => pw.length >= 8 },
  { label: 'Заглавная буква (A–Z)', validate: (pw) => /[A-Z]/.test(pw) },
  { label: 'Строчная буква (a–z)', validate: (pw) => /[a-z]/.test(pw) },
  { label: 'Цифра (0–9)', validate: (pw) => /[0-9]/.test(pw) },
  { label: 'Специальный символ (!@#$%)', validate: (pw) => /[\!\@\#\$\%]/.test(pw) }
];

const getPasswordStrength = (password) => {
  const passed = passwordRules.filter(rule => rule.validate(password)).length;
  if (passed < 3) return { label: 'Слабый', color: '#e57373' };
  if (passed < 5) return { label: 'Средний', color: '#ffb74d' };
  return { label: 'Сильный', color: '#81c784' };
};

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);

  // Формы
  const [loginForm, setLoginForm] = useState(() => {
    const saved = localStorage.getItem('loginFormData');
    return saved ? JSON.parse(saved) : { email: '', phone: '', password: '', loginBy: 'email', rememberMe: true };
  });

  const [registerForm, setRegisterForm] = useState(() => {
    const saved = localStorage.getItem('registerFormData');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', password: '', confirmPassword: '' };
  });

  const navigate = useNavigate();
  const toast = useRef(null);

  // Рефы
  const loginPasswordRef = useRef(null);
  const registerPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Мок-пользователи
  const mockUsers = [
    { email: 'admin@frolova.ru', phone: '+79001234567', password: '123', role: 'admin', name: 'Администратор' },
    { email: 'client@frolova.ru', phone: '+79007654321', password: '123', role: 'client', name: 'Анна' }
  ];

  // Сохранение форм
  useEffect(() => {
    if (loginForm.rememberMe) {
      localStorage.setItem('loginFormData', JSON.stringify(loginForm));
    }
  }, [loginForm]);

  useEffect(() => {
    localStorage.setItem('registerFormData', JSON.stringify(registerForm));
  }, [registerForm]);

  // Анимация при смене вкладок
  useEffect(() => {
    setSlideDirection('fade');
    const timer = setTimeout(() => setSlideDirection(null), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // === Вход ===
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (loginForm.loginBy === 'email' && !isValidEmail(loginForm.email)) {
      toast.current.show({
        severity: 'warn',
        summary: 'Ошибка',
        detail: 'Введите корректный email'
      });
      setLoading(false);
      return;
    }

    if (loginForm.loginBy === 'phone' && (!loginForm.phone || !isValidPhone(loginForm.phone))) {
      toast.current.show({
        severity: 'warn',
        summary: 'Ошибка',
        detail: 'Введите корректный телефон'
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const field = loginForm.loginBy === 'email' ? loginForm.email : formatPhoneForStorage(loginForm.phone);
      const user = mockUsers.find(u => {
        const match = loginForm.loginBy === 'email' ? u.email === field : u.phone === field;
        return match && u.password === loginForm.password;
      });

      if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        if (loginForm.rememberMe) {
          localStorage.setItem('lastLoggedInUser', JSON.stringify({
            email: user.email, phone: user.phone, name: user.name, role: user.role
          }));
        } else {
          localStorage.removeItem('lastLoggedInUser');
        }

        toast.current.show({
          severity: 'success',
          summary: 'Добро пожаловать',
          detail: `Здравствуйте, ${user.name}!`
        });

        setTimeout(() => {
        // Принудительное обновление страницы для мгновенного отображения Navbar
        window.location.href = user.role === 'admin' ? '/admin' : '/cabinet';
      }, 1000);
      } else {
        toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Неверные данные' });
      }
      setLoading(false);
    }, 800);
  };

  // === Регистрация ===
  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!registerForm.name.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Ошибка', detail: 'Введите имя' });
      setLoading(false);
      return;
    }

    if (!isValidEmail(registerForm.email)) {
      toast.current.show({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный email' });
      setLoading(false);
      return;
    }

    if (!registerForm.phone || !isValidPhone(registerForm.phone)) {
      toast.current.show({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный телефон' });
      setLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Пароли не совпадают' });
      setLoading(false);
      return;
    }

    const isValid = passwordRules.every(rule => rule.validate(registerForm.password));
    if (!isValid) {
      toast.current.show({ severity: 'warn', summary: 'Слабый пароль', detail: 'Пароль не соответствует требованиям' });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('userName', registerForm.name);
      localStorage.setItem('lastLoggedInUser', JSON.stringify({
        email: registerForm.email,
        phone: registerForm.phone,
        name: registerForm.name,
        role: 'client'
      }));

      toast.current.show({ severity: 'success', summary: 'Успешно', detail: `Добро пожаловать, ${registerForm.name}!` });

      setTimeout(() => {
        // Принудительное обновление страницы для мгновенного отображения Navbar
        window.location.href = '/cabinet';
      }, 1000);
      setLoading(false);
    }, 800);
  };

  // Анимация появления полей
  const animateField = (delay = 0) => ({
    style: {
      animation: `fadeInUpCustom 0.4s ease-out ${delay}s forwards`,
      opacity: 0,
      transform: 'translateY(10px)'
    }
  });

  // === Маски для телефонов — с elementRef ===
  const { ref: loginPhoneMaskRef } = useIMask(
    { mask: '+{7} (000) 000-00-00' },
    {
      onAccept(value) {
        setLoginForm({ ...loginForm, phone: value });
      }
    }
  );

  const { ref: registerPhoneMaskRef } = useIMask(
    { mask: '+{7} (000) 000-00-00' },
    {
      onAccept(value) {
        setRegisterForm({ ...registerForm, phone: value });
      }
    }
  );

  const passwordStrength = getPasswordStrength(registerForm.password);

  // === Кнопка "Выйти" ===
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    if (!loginForm.rememberMe) {
      localStorage.removeItem('loginFormData');
      localStorage.removeItem('registerFormData');
    }
    localStorage.removeItem('lastLoggedInUser');
    toast.current.show({
      severity: 'info',
      summary: 'Выход',
      detail: 'Вы успешно вышли из аккаунта'
    });
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-3"
      style={{
        background: 'linear-gradient(135deg, #f9f6f3 0%, #e6f1e8 100%)',
        fontFamily: 'Georgia, serif'
      }}
    >
      <Toast ref={toast} />

      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(90, 74, 66, 0.15)',
          background: '#ffffff',
          border: '1px solid #eae4dd',
          position: 'relative'
        }}
      >
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
          pt={{
            nav: { style: { display: 'flex', width: '100%', background: '#f8f4f0', padding: 0, margin: 0 } },
            tab: {
              style: { flex: 1, textAlign: 'center', padding: '1rem 0', fontWeight: 500, color: '#7a6d60' },
              className: 'hover:bg-[#e8e2db] hover:text-[#5a4a42]'
            },
            inkbar: { style: { display: 'none' } },
            'tab[aria-selected=true]': {
              style: {
                background: '#ffffff',
                color: '#5a4a42',
                fontWeight: 'bold',
                borderLeft: '1px solid #eae4dd',
                borderRight: '1px solid #eae4dd',
                borderTop: '3px solid #5a4a42'
              }
            }
          }}
        >
          {/* === Вкладка: Вход === */}
          <TabPanel
            header={
              <span>
                <i className="pi pi-sign-in mr-2" style={{ fontSize: '1.1rem' }}></i>
                Вход
              </span>
            }
          >
            <div className={`p-4 pt-3 transition-opacity duration-300 ${slideDirection ? 'opacity-0' : 'opacity-100'}`}>
              {loading ? (
                <div className="flex justify-content-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <form onSubmit={handleLogin} className="p-fluid">
                  {/* Способ входа */}
                  <div className="field mb-4" {...animateField(0.1)}>
                    <div className="flex align-items-center mb-2" style={{ color: '#5a4a42' }}>
                      <RadioButton
                        inputId="login-email"
                        name="loginBy"
                        value="email"
                        onChange={(e) => setLoginForm({ ...loginForm, loginBy: e.value })}
                        checked={loginForm.loginBy === 'email'}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <label htmlFor="login-email" className="mr-4">По почте</label>

                      <RadioButton
                        inputId="login-phone"
                        name="loginBy"
                        value="phone"
                        onChange={(e) => setLoginForm({ ...loginForm, loginBy: e.value })}
                        checked={loginForm.loginBy === 'phone'}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <label htmlFor="login-phone">По телефону</label>
                    </div>
                  </div>

                  {/* Email или Телефон */}
                  <div className="field mb-4" {...animateField(0.2)}>
                    {loginForm.loginBy === 'email' ? (
                      <>
                        <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Email</label>
                        <InputText
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                          placeholder="Введите email"
                          className="w-full p-inputtext"
                          autoFocus
                          style={{
                            padding: '0.85rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            border: '1px solid #d9d3ce'
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Телефон</label>
                        <InputText
                          value={loginForm.phone}
                          placeholder="+7 (999) 999-99-99"
                          className="w-full p-inputtext"
                          style={{
                            padding: '0.85rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            border: '1px solid #d9d3ce'
                          }}
                          elementRef={loginPhoneMaskRef}
                          onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                        />
                      </>
                    )}
                  </div>

                  {/* Пароль */}
                  <div className="field mb-4" {...animateField(0.3)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Пароль</label>
                    <Password
                      ref={loginPasswordRef}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      placeholder="Введите пароль"
                      toggleMask
                      feedback={false}
                      className="w-full p-inputtext"
                      inputStyle={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        border: '1px solid #d9d3ce'
                      }}
                      pt={{
                        toggleButton: {
                          style: { color: '#5a4a42', transition: 'color 0.3s ease' }
                        }
                      }}
                    />
                  </div>

                  {/* Запомнить меня */}
                  <div className="field mb-4 flex align-items-center" {...animateField(0.35)}>
                    <Checkbox
                      inputId="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <label htmlFor="rememberMe" style={{ color: '#7a6d60', fontSize: '0.95rem' }}>
                      Запомнить меня
                    </label>
                  </div>

                  <Button
                    label="Войти"
                    icon="pi pi-sign-in"
                    className={`w-full mt-3 ${styles.gradientButton}`}
                    style={{ padding: '0.9rem', fontSize: '1.1rem', fontWeight: 500 }}
                    disabled={loading}
                  />
                </form>
              )}
            </div>
          </TabPanel>

          {/* === Вкладка: Регистрация === */}
          <TabPanel
            header={
              <span>
                <i className="pi pi-user-plus mr-2" style={{ fontSize: '1.1rem' }}></i>
                Регистрация
              </span>
            }
          >
            <div className={`p-4 pt-3 transition-opacity duration-300 ${slideDirection ? 'opacity-0' : 'opacity-100'}`}>
              {loading ? (
                <div className="flex justify-content-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <form onSubmit={handleRegister} className="p-fluid">
                  {/* Имя */}
                  <div className="field mb-4" {...animateField(0.1)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Имя</label>
                    <InputText
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                      placeholder="Введите имя"
                      className="w-full p-inputtext"
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        border: '1px solid #d9d3ce'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="field mb-4" {...animateField(0.2)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Email</label>
                    <InputText
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      type="email"
                      placeholder="Введите email"
                      className="w-full p-inputtext"
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        border: '1px solid #d9d3ce'
                      }}
                    />
                  </div>

                  {/* Телефон */}
                  <div className="field mb-4" {...animateField(0.3)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Телефон</label>
                    <InputText
                      value={registerForm.phone}
                      placeholder="+7 (999) 999-99-99"
                      className="w-full p-inputtext"
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        border: '1px solid #d9d3ce'
                      }}
                      elementRef={registerPhoneMaskRef}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    />
                  </div>

                  {/* Пароль с анимированной легендой */}
                  <div className="field mb-4" {...animateField(0.4)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Пароль</label>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        alignItems: 'start'
                      }}
                    >
                      {/* Поле ввода */}
                      <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                        <Password
                          ref={registerPasswordRef}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                          placeholder="Введите пароль"
                          toggleMask
                          feedback={false}
                          className="w-full p-inputtext"
                          inputStyle={{
                            padding: '0.85rem',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            border: '1px solid #d9d3ce'
                          }}
                          onFocus={() => setShowPasswordPopup(true)}
                          onBlur={() => {
                            setTimeout(() => setShowPasswordPopup(false), 300);
                          }}
                          pt={{
                            toggleButton: {
                              style: { color: passwordStrength.color, transition: 'color 0.3s ease' }
                            }
                          }}
                        />

                        <div className="mt-3 flex align-items-center">
                          <div
                            className="h-1 flex-grow mr-2"
                            style={{
                              background: `linear-gradient(to right, ${passwordStrength.color} ${registerForm.password.length * 16}%, #e9e4e0 0)`
                            }}
                          ></div>
                          <small
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              color: passwordStrength.color
                            }}
                          >
                            {registerForm.password ? passwordStrength.label : ''}
                          </small>
                        </div>
                      </div>

                      {/* Анимированная легенда */}
                      <div
                        className={`password-legend transition-all duration-300 ease-out`}
                        style={{
                          flex: '1 1 300px',
                          minWidth: '280px',
                          backgroundColor: '#fafafa',
                          borderRadius: '8px',
                          padding: '1rem',
                          border: '1px solid #eae4dd',
                          fontSize: '0.85rem',
                          color: '#5a4a42',
                          boxShadow: '0 2px 6px rgba(90, 74, 66, 0.08)',
                          opacity: showPasswordPopup ? 1 : 0,
                          transform: showPasswordPopup ? 'translateY(0)' : 'translateY(-4px)',
                          pointerEvents: showPasswordPopup ? 'auto' : 'none',
                          height: showPasswordPopup ? 'auto' : 0,
                          overflow: 'hidden',
                          transition: 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease'
                        }}
                      >
                        <div className="font-medium mb-2" style={{ color: '#5a4a42' }}>Требования к паролю:</div>
                        <ul className="m-0 p-0 list-none">
                          {passwordRules.map((rule, i) => {
                            const passed = rule.validate(registerForm.password);
                            return (
                              <li key={i} className={passed ? 'text-green-600' : 'text-pink-600'} style={{ marginBottom: '0.4rem' }}>
                                <i
                                  className={`pi ${passed ? 'pi-check' : 'pi-times'} mr-2`}
                                  style={{
                                    fontSize: '0.7rem',
                                    color: passed ? '#4caf50' : '#f44336'
                                  }}
                                ></i>
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Подтвердите пароль */}
                  <div className="field mb-4" {...animateField(0.5)}>
                    <label className="block text-900 font-medium mb-2" style={{ color: '#5a4a42' }}>Подтвердите пароль</label>
                    <Password
                      ref={confirmPasswordRef}
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Повторите пароль"
                      toggleMask
                      feedback={false}
                      className="w-full p-inputtext"
                      inputStyle={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        border: '1px solid #d9d3ce'
                      }}
                    />
                  </div>

                  <Button
                    label="Зарегистрироваться"
                    icon="pi pi-user-plus"
                    className={`w-full mt-3 ${styles.gradientButton}`}
                    style={{ padding: '0.9rem', fontSize: '1.1rem', fontWeight: 500 }}
                    disabled={loading}
                  />
                </form>
              )}
            </div>
          </TabPanel>
        </TabView>

        {/* Кнопка "Выйти" */}
        {localStorage.getItem('userRole') && (
          <div className="p-3 bg-gray-50 border-top-1 border-gray-200">
            <Button
              label="Выйти"
              icon="pi pi-sign-out"
              className="w-full p-button-outlined p-button-danger"
              onClick={handleLogout}
              style={{ fontSize: '0.95rem', padding: '0.6rem' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
