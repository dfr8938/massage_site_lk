// client/src/pages/AdminPanel.jsx
import { useState } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Анна К.',
      text: 'После трёх сеансов пропала хроническая боль в пояснице.',
      rating: 5,
      date: '2025-04-15',
      approved: true
    },
    {
      id: 2,
      name: 'Дмитрий П.',
      text: 'Проходил курс спортивного массажа перед соревнованиями.',
      rating: 5,
      date: '2025-04-08',
      approved: false
    }
  ]);

  const [pendingAppointments, setPendingAppointments] = useState([
    {
      id: 1,
      client: 'Анна К.',
      date: '2025-05-01 10:30',
      service: 'Классический массаж',
      status: 'Ожидание подтверждения'
    },
    {
      id: 2,
      client: 'Олег С.',
      date: '2025-05-02 15:00',
      service: 'Лечебный массаж',
      status: 'Ожидание подтверждения'
    }
  ]);

  const [confirmedAppointments, setConfirmedAppointments] = useState([
    {
      id: 3,
      client: 'Сергей В.',
      date: '2025-04-28 14:00',
      service: 'Спортивный массаж',
      status: 'Подтверждено'
    },
    {
      id: 4,
      client: 'Елена М.',
      date: '2025-04-29 16:30',
      service: 'Массаж головы и шеи',
      status: 'Подтверждено'
    }
  ]);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('date-desc');

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const parseDate = (dateTimeStr) => {
    return new Date(dateTimeStr.split(' ')[0]);
  };

  const filteredPending = pendingAppointments
    .filter(app => {
      const clientMatch = app.client.toLowerCase().includes(searchTerm.toLowerCase());
      const date = parseDate(app.date);
      const fromMatch = !dateFrom || date >= new Date(dateFrom);
      const toMatch = !dateTo || date <= new Date(dateTo);
      return clientMatch && fromMatch && toMatch;
    })
    .sort((a, b) => {
      if (sort === 'date-asc') return parseDate(a.date) - parseDate(b.date);
      if (sort === 'date-desc') return parseDate(b.date) - parseDate(a.date);
      if (sort === 'client-asc') return a.client.localeCompare(b.client);
      if (sort === 'client-desc') return b.client.localeCompare(a.client);
      return 0;
    });

  const filteredConfirmed = confirmedAppointments
  .filter(app => {
    const clientMatch = app.client.toLowerCase().includes(searchTerm.toLowerCase());
    const date = parseDate(app.date);
    const fromMatch = !dateFrom || date >= new Date(dateFrom);
    const toMatch = !dateTo || date <= new Date(dateTo);
    return clientMatch && fromMatch && toMatch;
  })
  .sort((a, b) => {
    if (sort === 'date-asc') return parseDate(a.date) - parseDate(b.date);
    if (sort === 'date-desc') return parseDate(b.date) - parseDate(a.date);
    if (sort === 'client-asc') return a.client.localeCompare(b.client);
    if (sort === 'client-desc') return b.client.localeCompare(a.client);
    return 0;
  });

    // --- Управление отзывами ---
  const toggleApproval = (id) => {
    setReviews(
      reviews.map(review =>
        review.id === id ? { ...review, approved: !review.approved } : review
      )
    );
    showNotification('Статус отзыва обновлён');
  };

  const deleteReview = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить отзыв?')) {
      setReviews(reviews.filter(review => review.id !== id));
      showNotification('Отзыв удалён');
    }
  };

  // --- Подтвердить запись ---
  const confirmAppointment = (id) => {
    const app = pendingAppointments.find(a => a.id === id);
    if (!app) return;

    setPendingAppointments(prev => prev.filter(a => a.id !== id));
    setConfirmedAppointments(prev => [app, ...prev]);
    showNotification('Запись подтверждена', 'success');
  };

  // --- Отклонить запись ---
  const rejectAppointment = (id) => {
    if (window.confirm('Отклонить эту запись?')) {
      setPendingAppointments(prev => prev.filter(a => a.id !== id));
      showNotification('Запись отклонена', 'info');
    }
  };

  // --- Отменить подтверждённую (вернуть в ожидание) ---
  const cancelConfirmedAppointment = (id) => {
    const app = confirmedAppointments.find(a => a.id === id);
    if (!app) return;

    if (window.confirm('Вернуть эту запись на подтверждение?')) {
      setConfirmedAppointments(prev => prev.filter(a => a.id !== id));
      setPendingAppointments(prev => [app, ...prev]);
      showNotification('Запись возвращена на подтверждение', 'info');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      color: '#444',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Уведомление */}
      {notification.show && (
        <div style={{
          backgroundColor: notification.type === 'success' ? '#d4edda' : '#fff3cd',
          color: notification.type === 'success' ? '#155724' : '#856404',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          border: '1px solid',
          borderColor: notification.type === 'success' ? '#c3e6cb' : '#ffeaa7',
          textAlign: 'center'
        }}>
          {notification.message}
        </div>
      )}

      <h2 style={{
        color: '#5a4a42',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Админ-панель
      </h2>

      {/* Фильтры и поиск */}
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 1rem', color: '#5a4a42' }}>Фильтры</h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={labelStyle}>Поиск по клиенту</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Имя..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>С</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>По</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Сортировка</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={inputStyle}>
              <option value="date-desc">Дата ↓</option>
              <option value="date-asc">Дата ↑</option>
              <option value="client-asc">Клиент А → Я</option>
              <option value="client-desc">Клиент Я → А</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
              setSort('date-desc');
            }}
            style={{
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Меню вкладок */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #ddd'
      }}>
        <button onClick={() => setActiveTab('pending')} style={tabStyle(activeTab === 'pending')}>
          На подтверждение
        </button>
        <button onClick={() => setActiveTab('confirmed')} style={tabStyle(activeTab === 'confirmed')}>
          Подтверждённые
        </button>
        <button onClick={() => setActiveTab('reviews')} style={tabStyle(activeTab === 'reviews')}>
          Отзывы
        </button>
      </div>

      {/* Вкладка: На подтверждение */}
      {activeTab === 'pending' && (
        <div>
          <h3 style={{ color: '#5a4a42', marginBottom: '1rem' }}>Записи на подтверждение</h3>
          {filteredPending.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>
              {pendingAppointments.length === 0 ? 'Нет записей на подтверждение' : 'Нет записей по фильтру'}
            </p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={headerRowStyle}>
                  <th style={thStyle}>Клиент</th>
                  <th style={thStyle}>Дата и время</th>
                  <th style={thStyle}>Услуга</th>
                  <th style={thStyle}>Статус</th>
                  <th style={thStyle}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.map(app => (
                  <tr key={app.id} style={rowStyle}>
                    <td style={tdStyle}>{app.client}</td>
                    <td style={tdStyle}>{app.date}</td>
                    <td style={tdStyle}>{app.service}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusStyle,
                        backgroundColor: '#fff3cd',
                        color: '#856404'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => confirmAppointment(app.id)} style={actionButtonStyle('#4CAF50')}>
                        Подтвердить
                      </button>
                      <button onClick={() => rejectAppointment(app.id)} style={actionButtonStyle('#dc3545')}>
                        Отклонить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Вкладка: Подтверждённые */}
      {activeTab === 'confirmed' && (
        <div>
          <h3 style={{ color: '#5a4a42', marginBottom: '1rem' }}>Подтверждённые записи</h3>
          {filteredConfirmed.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>
              {confirmedAppointments.length === 0 ? 'Нет подтверждённых записей' : 'Нет записей по фильтру'}
            </p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={headerRowStyle}>
                  <th style={thStyle}>Клиент</th>
                  <th style={thStyle}>Дата и время</th>
                  <th style={thStyle}>Услуга</th>
                  <th style={thStyle}>Статус</th>
                  <th style={thStyle}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredConfirmed.map(app => (
                  <tr key={app.id} style={rowStyle}>
                    <td style={tdStyle}>{app.client}</td>
                    <td style={tdStyle}>{app.date}</td>
                    <td style={tdStyle}>{app.service}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusStyle,
                        backgroundColor: '#d4edda',
                        color: '#155724'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => cancelConfirmedAppointment(app.id)}
                        style={actionButtonStyle('#ffc107', '#212529')}
                      >
                        Вернуть
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Вкладка: Отзывы */}
      {activeTab === 'reviews' && (
        <div>
          <h3 style={{ color: '#5a4a42', marginBottom: '1rem' }}>Отзывы</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={thStyle}>Дата</th>
                <th style={thStyle}>Имя</th>
                <th style={thStyle}>Текст</th>
                <th style={thStyle}>Оценка</th>
                <th style={thStyle}>Статус</th>
                <th style={thStyle}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} style={rowStyle}>
                  <td style={tdStyle}>{review.date}</td>
                  <td style={tdStyle}>{review.name}</td>
                  <td style={tdStyle}>{review.text}</td>
                  <td style={tdStyle}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...statusStyle,
                      backgroundColor: review.approved ? '#d4edda' : '#fff3cd',
                      color: review.approved ? '#155724' : '#856404'
                    }}>
                      {review.approved ? 'Опубликован' : 'На модерации'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => toggleApproval(review.id)} style={actionButtonStyle(review.approved ? '#e9ecef' : '#4CAF50', '#495057')}>
                      {review.approved ? 'Снять' : 'Одобрить'}
                    </button>
                    <button onClick={() => deleteReview(review.id)} style={actionButtonStyle('#dc3545')}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Стили ---
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  marginBottom: '2rem'
};

const headerRowStyle = {
  backgroundColor: '#5a4a42',
  color: '#f8f4f0'
};

const thStyle = {
  textAlign: 'left',
  padding: '1rem',
  fontWeight: 'normal'
};

const tdStyle = {
  padding: '1rem',
  fontSize: '0.95rem'
};

const rowStyle = {
  borderBottom: '1px solid #eee'
};

const statusStyle = {
  padding: '0.4rem 0.8rem',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: 'bold'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  marginBottom: '0.5rem',
  color: '#5a4a42'
};

const inputStyle = {
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '0.9rem'
};

const actionButtonStyle = (bgColor, textColor = '#fff') => ({
  border: 'none',
  padding: '0.5rem 0.8rem',
  borderRadius: '4px',
  fontSize: '0.85rem',
  margin: '0 0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  backgroundColor: bgColor,
  color: textColor
});

const tabStyle = (isActive) => ({
  padding: '0.75rem 1.5rem',
  border: 'none',
  backgroundColor: isActive ? '#5a4a42' : '#f8f4f0',
  color: isActive ? '#fff' : '#5a4a42',
  cursor: 'pointer',
  borderRadius: isActive ? '6px 6px 0 0' : '0'
});

export default AdminPanel;

