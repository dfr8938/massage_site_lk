import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import MyReviews from '../components/MyReviews';
import VisitHistory from '../components/VisitHistory';
import MyData from '../components/MyData';
import Achievements from '../components/Achievements';
import Help from '../components/Help';
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
    { id: 1, name: 'Классический массаж', price: 2500, duration: 60 },
    { id: 2, name: 'Лечебный массаж', price: 3200, duration: 90 }
  ]);

  // Блокированные даты и временные слоты (получаются с сервера)
  const [blockedDates, setBlockedDates] = useState([
    new Date(2025, 4, 10),
    new Date(2025, 4, 15)
  ]);

  const [blockedTimeSlots, setBlockedTimeSlots] = useState([
    { date: '2025-05-10', time: '12:00' },
    { date: '2025-05-10', time: '15:30' }
  ]);

  // Состояние активной вкладки
  const [activeIndex, setActiveIndex] = useState(0);

  // Управление отзывами
  const [userReviews, setUserReviews] = useState([
    { id: 1, text: 'Отличный специалист, очень помог с болью в спине!', rating: 5, date: '2025-04-15' },
    { id: 2, text: 'Приятная атмосфера, качественный массаж.', rating: 5, date: '2025-04-08' }
  ]);

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

  // Управление отзывами
  const handleAddReview = (review) => {
    setUserReviews([review, ...userReviews]);
    toast.current.show({
      severity: 'success', 
      summary: 'Спасибо!', 
      detail: 'Ваш отзыв опубликован'
    });
  };

  const handleEditReview = (id, updatedReview) => {
    setUserReviews(userReviews.map(r => r.id === id ? { ...r, ...updatedReview } : r));
    toast.current.show({
      severity: 'success', 
      summary: 'Обновлено', 
      detail: 'Ваш отзыв изменен'
    });
  };

  const handleDeleteReview = (id) => {
    setUserReviews(userReviews.filter(r => r.id !== id));
    toast.current.show({
      severity: 'info', 
      summary: 'Удалено', 
      detail: 'Ваш отзыв удален'
    });
  };

  // Удаление аккаунта
  const handleDeleteAccount = () => {
    toast.current.show({
      severity: 'warn', 
      summary: 'Аккаунт удален', 
      detail: 'Ваш аккаунт и все данные успешно удалены'
    });
    // В реальной реализации здесь был бы вызов API
    // и перенаправление на главную страницу
  };

  // Состояние для управления диалогами
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    visible: false,
    message: '',
    header: '',
    accept: () => {},
    reject: () => {}
  });

  // Показ диалога подтверждения
  const showConfirmDialog = (props) => {
    setConfirmDialogProps({
      visible: true,
      ...props
    });
  };

  // Запись на прием
  const handleAppointmentSubmit = (appointmentData) => {
    // Находим услугу по ID
    const service = services.find(s => s.id === appointmentData.serviceId);
    
    if (service) {
      // Показываем диалог подтверждения
      showConfirmDialog({
        message: `Вы уверены, что хотите записаться на ${appointmentData.date.toLocaleDateString('ru-RU')} в ${appointmentData.date.getHours()}:${appointmentData.date.getMinutes().toString().padStart(2, '0')} на услугу ${service.name}?`,
        header: 'Подтверждение записи',
        accept: () => {
          // Создаем новую запись
          const newAppointment = {
            id: appointments.length + 1,
            serviceId: service.id,
            date: appointmentData.date,
            status: 'pending'
          };
          setAppointments([newAppointment, ...appointments]);
          
          // Показываем сообщение об успешной записи
          toast.current.show({
            severity: 'success', 
            summary: 'Запись создана', 
            detail: `Вы успешно записаны на ${service.name}`
          });
          
          // Скрываем диалог
          setConfirmDialogProps(prev => ({ ...prev, visible: false }));
        },
        reject: () => {
          // Показываем сообщение об отмене
          toast.current.show({
            severity: 'info', 
            summary: 'Запись отменена', 
            detail: 'Создание записи отменено'
          });
          
          // Скрываем диалог
          setConfirmDialogProps(prev => ({ ...prev, visible: false }));
        }
      });
    } else {
      toast.current.show({
        severity: 'error', 
        summary: 'Ошибка', 
        detail: 'Услуга не найдена'
      });
    }
  };

  // Перенести запись (создает новую запись с теми же параметрами и отменяет старую)
  const handleReschedule = (appointment) => {
    // Находим услугу по ID
    const service = services.find(s => s.id === appointment.serviceId);
    
    if (service) {
      // Форматируем дату старой записи для отображения
      const oldDate = new Date(appointment.date);
      const oldDateFormatted = oldDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Показываем диалог подтверждения
      showConfirmDialog({
        message: `Вы уверены, что хотите перенести запись на ${service.name} с ${oldDateFormatted}? Старая запись будет отменена, и вам нужно будет выбрать новую дату и время.`,
        header: 'Подтверждение переноса',
        accept: () => {
          // Создаем новую запись
          const newAppointment = {
            id: appointments.length + 1,
            serviceId: service.id,
            date: null, // Дата не устанавливается, пользователь выберет ее сам
            status: 'pending'
          };
          
          // Обновляем массив записей: добавляем новую и отменяем старую
          const updatedAppointments = [
            newAppointment,
            ...appointments.map(app => 
              app.id === appointment.id 
                ? { ...app, status: 'cancelled' } 
                : app
            )
          ];
          
          setAppointments(updatedAppointments);
          
          // Показываем сообщение об успешном переносе
          toast.current.show({
            severity: 'info', 
            summary: 'Запись перенесена', 
            detail: `Старая запись на ${oldDateFormatted} отменена, новая запись на ${service.name} создана. Выберите дату и время.`
          });
          
          // Скрываем диалог
          setConfirmDialogProps(prev => ({ ...prev, visible: false }));
        },
        reject: () => {
          // Показываем сообщение об отмене
          toast.current.show({
            severity: 'info', 
            summary: 'Перенос отменен', 
            detail: 'Перенос записи отменен'
          });
          
          // Скрываем диалог
          setConfirmDialogProps(prev => ({ ...prev, visible: false }));
        },
        acceptLabel: 'Да, перенести',
        rejectLabel: 'Отмена',
        draggable: false,
        closeOnEscape: true,
        dismissable: true
      });
    } else {
      toast.current.show({
        severity: 'error', 
        summary: 'Ошибка', 
        detail: 'Услуга не найдена'
      });
    }
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
      <ConfirmDialog 
        visible={confirmDialogProps.visible}
        message={confirmDialogProps.message}
        header={confirmDialogProps.header}
        icon="pi pi-exclamation-triangle"
        accept={confirmDialogProps.accept}
        reject={confirmDialogProps.reject}
        acceptLabel="Да, записаться"
        rejectLabel="Отмена"
        draggable={false}
        closeOnEscape={true}
        dismissable={true}
      />

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
            'Мои данные',
            'Мои отзывы',
            'История посещений и записи',
            'Мои достижения',
            'Помощь'
          ][activeIndex]}
        </div>
        <Button
          icon="pi pi-angle-right"
          className="p-button-text p-button-rounded"
          disabled={activeIndex === 4}
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
              <i className="pi pi-bolt mr-2"></i>Мои данные
            </h4>
            <MyData 
              profile={profile}
              onSave={handleProfileSave}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        )}

        {activeIndex === 1 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-comments mr-2"></i>Мои отзывы
            </h4>
            <MyReviews 
              reviews={userReviews}
              onAddReview={handleAddReview}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
            />
          </div>
        )}

        {activeIndex === 2 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-calendar-check mr-2"></i>История посещений и записи
            </h4>
            <div className="grid">
              <div className="col-12">
                <VisitHistory 
                  appointments={appointments}
                  services={services}
                  onReschedule={handleReschedule}
                />
              </div>
              <div className="col-12">
                <AppointmentList 
                  appointments={appointments} 
                  onReschedule={handleAppointmentReschedule} 
                  onCancel={handleAppointmentCancel} 
                  services={services}
                />
              </div>
              <div className="col-12">
                <AppointmentForm 
                  services={services} 
                  onSubmit={handleAppointmentSubmit} 
                  blockedDates={blockedDates} 
                  blockedTimeSlots={blockedTimeSlots} 
                  title="Записаться на прием" 
                />
              </div>
            </div>
          </div>
        )}

        {activeIndex === 3 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-star-fill mr-2"></i>Мои достижения
            </h4>
            <Achievements 
              appointments={appointments}
            />
          </div>
        )}

        {activeIndex === 4 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-question-circle mr-2"></i>Помощь
            </h4>
            <Help />
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