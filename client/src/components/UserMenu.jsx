// client/src/components/UserMenu.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Пользователь');

  // Слушаем изменения localStorage (например, после выхода)
  useEffect(() => {
    const updateAuthState = () => {
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName') || 'Пользователь';
      setUserRole(role);
      setUserName(name);
    };

    // Обновляем при входе/выходе
    window.addEventListener('storage', updateAuthState);

    // Также проверяем при монтировании
    updateAuthState();

    return () => {
      window.removeEventListener('storage', updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      // Очищаем данные
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');

      // Оповещаем другие части приложения (например, другие компоненты или вкладки)
      window.dispatchEvent(new Event('storage'));

      // Обновляем состояние
      setUserRole(null);
      setUserName('Пользователь');

      // Перенаправляем
      navigate('/', { replace: true });
    }
  };

  // Если пользователь не авторизован — не показываем меню
  if (!userRole) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {/* Приветствие */}
      <span style={greetingStyle}>
        Здравствуйте, {userName}
      </span>

      {/* Кнопка: Личный кабинет (только для клиентов) */}
      {userRole === 'client' && (
        <button
          onClick={() => navigate('/cabinet')}
          style={navButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a4a42';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#5a4a42';
          }}
        >
          Личный кабинет
        </button>
      )}

      {/* Кнопка: Админ-панель (только для админа) */}
      {userRole === 'admin' && (
        <button
          onClick={() => navigate('/admin')}
          style={navButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a4a42';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#5a4a42';
          }}
        >
          Админ-панель
        </button>
      )}

      {/* Кнопка: Выйти */}
      <button
        onClick={handleLogout}
        style={logoutButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5a6268';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6c757d';
        }}
      >
        Выйти
      </button>
    </div>
  );
};

// === Стили ===
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  fontSize: '0.9rem'
};

const greetingStyle = {
  color: '#5a4a42',
  fontWeight: 'bold'
};

const navButtonStyle = {
  color: '#5a4a42',
  textDecoration: 'none',
  border: '1px solid #5a4a42',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const logoutButtonStyle = {
  ...navButtonStyle,
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none'
};

export default UserMenu;
