// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ClientCabinet from './pages/ClientCabinet';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// === Хук для отслеживания изменения роли (при logout/входе из другого окна) ===
const useUser = () => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));

  const updateUserRole = useCallback(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  useEffect(() => {
    // Слушаем изменения localStorage
    const handleStorage = () => updateUserRole();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [updateUserRole]);

  return { userRole, setUserRole: updateUserRole };
};

// === Приватный маршрут ===
const PrivateRoute = ({ children, allowedRoles }) => {
  const { userRole } = useUser();
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// === Автовход при загрузке — если "Запомнить меня" ===
const useAutoLogin = () => {
  useEffect(() => {
    const lastUser = localStorage.getItem('lastLoggedInUser');
    const loginData = localStorage.getItem('loginFormData');
    if (lastUser && loginData) {
      const parsed = JSON.parse(loginData);
      if (parsed.rememberMe) {
        // Можно отправить silent-запрос, но у нас mock → просто считаем, что вошёл
        // Пользователь уже в localStorage → ничего не делаем
      } else {
        // Не запоминать → очистим, если нужно
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      }
    }
  }, []);
};

// === Основной контент ===
const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { userRole } = useUser();

  // Автовход
  useAutoLogin();

  // Прелоадер при смене маршрута
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Плавнее, чем 600

    return () => clearTimeout(timer);
  }, [location.key]);

  return (
    <>
      {loading && <Preloader />}

      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        <Navbar userRole={userRole} />

        <main
          style={{
            flex: 1,
            padding: '1rem',
            position: 'relative',
            minHeight: 'calc(100vh - 200px)' // Защита от сжатия
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/cabinet"
              element={
                <PrivateRoute allowedRoles={['client']}>
                  <ClientCabinet />
                </PrivateRoute>
              }
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          fontFamily: 'Georgia, serif',
          backgroundColor: '#fcfaf8',
          color: '#5a4a42'
        }}
      >
        <AppContent />
      </div>
    </Router>
  );
};

export default App;
