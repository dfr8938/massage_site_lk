import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../pages/ClientCabinet.module.css';

const AppointmentForm = ({ services, onSubmit, blockedDates, blockedTimeSlots }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const filteredTimes = selectedDate ? availableTimes.filter(time => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return !blockedTimeSlots.some(slot => 
      slot.date === dateStr && slot.time === time
    );
  }) : [];

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    onSubmit({
      date: selectedDate,
      time: selectedTime,
      service: selectedService
    });
    
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedService(null);
  };

  return (
    <div className="card p-4" style={{ background: '#f9f6f3', borderRadius: '12px' }}>
      <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
        <i className="pi pi-calendar-plus mr-2"></i>Записаться на прием
      </h4>
      
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="date" style={{ color: '#5a4a42', fontWeight: 500 }}>Дата</label>
          <Calendar
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            dateFormat="dd.mm.yy"
            showIcon
            minDate={new Date()}
            disabledDates={blockedDates}
            style={{ width: '100%' }}
            inputStyle={{
              height: '42px',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid #cfc9c2',
              fontSize: '1rem',
              color: '#5a4a42'
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="time" style={{ color: '#5a4a42', fontWeight: 500 }}>Время</label>
          <Dropdown
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.value)}
            options={filteredTimes}
            placeholder="Выберите время"
            disabled={!selectedDate || filteredTimes.length === 0}
            style={{ width: '100%' }}
            inputStyle={{
              height: '42px',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid #cfc9c2',
              fontSize: '1rem',
              color: '#5a4a42'
            }}
          />
          {selectedDate && filteredTimes.length === 0 && (
            <small style={{ color: '#992a2a', display: 'block', marginTop: '0.5rem' }}>
              Нет доступного времени на выбранную дату
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="service" style={{ color: '#5a4a42', fontWeight: 500 }}>Услуга</label>
          <Dropdown
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.value)}
            options={services}
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите услугу"
            style={{ width: '100%' }}
            inputStyle={{
              height: '42px',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid #cfc9c2',
              fontSize: '1rem',
              color: '#5a4a42'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Button
          label="Записаться"
          icon="pi pi-check"
          onClick={handleSubmit}
          className={styles['gradient-button']}
          disabled={!selectedDate || !selectedTime || !selectedService}
        />
      </div>
    </div>
  );
};

export default AppointmentForm;