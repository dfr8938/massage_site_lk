import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import ProfileCard from '../components/ProfileCard';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import styles from './ClientCabinet.module.css';

const ClientCabinet = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  // Данные клиента
  const [profile, setProfile] = useState({
    name: 'Анна К.',
    email: 'anna@example.com',
    phone: '+7 (916) 123-45-67',
    address: 'г. Москва, ул. Примерная, д. 1, кв. 1'
  });

  // Записи клиента
  const [appointments, setAppointments] = useState([
    { id: 1, date: new Date('2025-05-10T10:30'), service: 'Классический массаж', serviceId: 1, status: 'confirmed' },
    { id: 2, date: new Date('2025-05-15T14:00'), service: 'Лечебный массаж', serviceId: 2, status: 'pending' }
  ]);

  // Услуги
  const [services, setServices] = useState([
    { id: 1, name: 'Классический массаж', price: 2500 },
    { id: 2, name: 'Лечебный массаж', price: 3200 }
  ]);

  // Блокированные даты и временные слоты (получаются с сервера)
  const [blockedDates, setBlockedDates] = useState([
    new Date(2025, 0, 10),
    new Date(2025, 0, 15)
  ]);

  const [blockedTimeSlots, setBlockedTimeSlots] = useState([
    { date: '2025-01-10', time: '12:00' },
    { date: '2025-01-10', time: '15:30' }
  ]);

  // Состояние активной вкладки
  const [activeIndex, setActiveIndex] = useState(0);

  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Обновление профиля
  const handleProfileSave = (updatedProfile) => {
    setProfile(updatedProfile);
    toast.current.show({
      severity: 'success', 
      summary: 'Сохранено', 
      detail: 'Данные профиля обновлены'
    });
  };

  // Запись на прием
  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: 'pending'
    };
    setAppointments([newAppointment, ...appointments]);
    toast.current.show({
      severity: 'success', 
      summary: 'Запись создана', 
      detail: `Вы записаны на ${appointmentData.service.name}`
    });
  };

  // Отмена записи
  const handleAppointmentCancel = (appointment) => {
    setAppointments(appointments.filter(a => a.id !== appointment.id));
  };

  // Перенос записи
  const handleAppointmentReschedule = (appointment) => {
    // В реальной реализации это могло бы открывать форму редактирования
    toast.current.show({
      severity: 'info', 
      summary: 'Перенос', 
      detail: 'Функция переноса в разработке'
    });
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <h2 className={styles.header}>
        <span className={styles['title-reveal']} data-text="Личный кабинет">
          Личный кабинет
        </span>
      </h2>
      <p className={styles.subheader}>Управление вашими записями и профилем</p>

      <div className={styles.dividerBlock}></div>

      {/* Управление вкладками со стрелками */}
      <div className="flex align-items-center justify-content-between mb-4">
        <Button
          icon="pi pi-angle-left"
          className="p-button-text p-button-rounded"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(activeIndex - 1)}
          aria-label="Предыдущая вкладка"
          style={{ color: '#5a4a42' }}
        />
        <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#5a4a42' }}>
          {[
            'Мой профиль',
            'Записаться',
            'Мои записи'
          ][activeIndex]}
        </div>
        <Button
          icon="pi pi-angle-right"
          className="p-button-text p-button-rounded"
          disabled={activeIndex === 2}
          onClick={() => setActiveIndex(activeIndex + 1)}
          aria-label="Следующая вкладка"
          style={{ color: '#5a4a42' }}
        />
      </div>

      {/* Отрисовка активной вкладки */}
      <div className="card p-4" style={{ background: '#f9f6f3', borderRadius: '12px' }}>
        {activeIndex === 0 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-user mr-2"></i>Мой профиль
            </h4>
            <ProfileCard 
              profile={profile} 
              onSave={handleProfileSave} 
            />
          </div>
        )}

        {activeIndex === 1 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-calendar-plus mr-2"></i>Записаться на прием
            </h4>
            <AppointmentForm 
              services={services} 
              onSubmit={handleAppointmentSubmit} 
              blockedDates={blockedDates} 
              blockedTimeSlots={blockedTimeSlots} 
            />
          </div>
        )}

        {activeIndex === 2 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-list mr-2"></i>Мои записи
            </h4>
            <AppointmentList 
              appointments={appointments} 
              onReschedule={handleAppointmentReschedule} 
              onCancel={handleAppointmentCancel} 
              services={services}
            />
          </div>
        )}
      </div>

      <div className="flex justify-content-end" style={{ marginTop: '2rem' }}>
        <button 
          onClick={handleLogout} 
          className="p-button p-button-danger"
          style={{
            background: 'linear-gradient(90deg, #fdf5f5, #fdecec)',
            borderColor: '#f5c6c6',
            color: '#992a2a',
            fontWeight: '500',
            padding: '0.5rem 1.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 198, 198, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="pi pi-sign-out mr-2" style={{ fontSize: '1.1rem' }}></i>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ClientCabinet;