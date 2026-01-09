import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

const AppointmentForm = ({ 
  services = [], 
  onSubmit, 
  blockedDates = [], 
  blockedTimeSlots = [], 
  title = "Записаться на прием" 
}) => {
  const [formData, setFormData] = useState({
    serviceId: null,
    date: null,
    time: null
  });
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const toast = React.useRef(null);

  // Получаем доступные услуги (активные)
  const availableServices = services.filter(service => service.active !== false);

  // Форматируем дату для сравнения
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Проверяем, заблокировано ли время
  const isTimeBlocked = (date, time) => {
    const dateString = formatDate(date);
    return blockedTimeSlots.some(slot => 
      slot.date === dateString && slot.time === time
    );
  };

  // Генерируем доступные временные слоты
  const generateTimeSlots = (service) => {
    if (!service || !formData.date) return [];
    
    const duration = service.duration;
    const slots = [];
    
    // Определяем рабочее время
    const startHour = 9;
    const endHour = 18;
    
    // Генерируем слоты
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === endHour - 1 && minute + 15 > 60) break;
        
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Проверяем, не выходит ли слот за пределы рабочего времени
        const endHourForSlot = hour + Math.floor((minute + duration) / 60);
        const endMinuteForSlot = (minute + duration) % 60;
        
        if (endHourForSlot >= endHour && (endHourForSlot > endHour || endMinuteForSlot > 0)) {
          continue;
        }
        
        // Проверяем, заблокировано ли время
        if (isTimeBlocked(formData.date, time)) {
          continue;
        }
        
        slots.push(time);
      }
    }
    
    return slots;
  };

  // Обновляем доступные временные слоты при изменении услуги или даты
  React.useEffect(() => {
    if (formData.serviceId && formData.date) {
      const selectedService = services.find(s => s.id === formData.serviceId);
      const timeSlots = generateTimeSlots(selectedService);
      setAvailableTimes(timeSlots);
      
      // Если выбранное время больше не доступно, сбрасываем его
      if (formData.time && !timeSlots.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: null }));
      }
    } else {
      setAvailableTimes([]);
    }
  }, [formData.serviceId, formData.date, services, blockedTimeSlots]);

  // Проверка, доступна ли дата
  const isDateAvailable = (date) => {
    // Проверяем, не заблокирована ли дата
    if (blockedDates.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    )) {
      return false;
    }
    
    // Проверяем, не в прошлом ли дата
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  // Фильтрация заблокированных дат для календаря
  const isDateSelectable = (date) => {
    return isDateAvailable(new Date(date.year, date.month, date.day));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.serviceId) newErrors.serviceId = 'Услуга обязательна';
    if (!formData.date) newErrors.date = 'Дата обязательна';
    if (!formData.time) newErrors.time = 'Время обязательно';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Передаем данные на верхний уровень для обработки
      onSubmit({
        serviceId: formData.serviceId,
        date: new Date(
          formData.date.getFullYear(),
          formData.date.getMonth(),
          formData.date.getDate(),
          parseInt(formData.time.split(':')[0]),
          parseInt(formData.time.split(':')[1])
        )
      });
      
      // Сбрасываем форму
      setFormData({
        serviceId: null,
        date: null,
        time: null
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: '#5a4a42', marginBottom: '1rem' }}>{title}</h4>
        
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="service" className="block font-medium mb-2">
              Услуга <span style={{ color: 'red' }}>*</span>
            </label>
            <Dropdown
              id="service"
              value={formData.serviceId}
              options={availableServices.map(service => ({
                label: `${service.name} - ${service.price}₽ (${service.duration} мин)`,
                value: service.id
              }))}
              onChange={(e) => setFormData({...formData, serviceId: e.value, time: null})}
              placeholder="Выберите услугу"
              className={errors.serviceId ? 'p-invalid w-full' : 'w-full'}
              filter
            />
            {errors.serviceId && <small className="p-error">{errors.serviceId}</small>}
          </div>
          
          <div className="field">
            <label htmlFor="date" className="block font-medium mb-2">
              Дата <span style={{ color: 'red' }}>*</span>
            </label>
            <Calendar
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.value, time: null})}
              dateFormat="dd.mm.yy"
              placeholder="Выберите дату"
              className={errors.date ? 'p-invalid w-full' : 'w-full'}
              showIcon
              required
              minDate={new Date()}
              filterDate={isDateSelectable}
            />
            {errors.date && <small className="p-error">{errors.date}</small>}
          </div>
          
          <div className="field">
            <label htmlFor="time" className="block font-medium mb-2">
              Время <span style={{ color: 'red' }}>*</span>
            </label>
            <Dropdown
              id="time"
              value={formData.time}
              options={availableTimes.map(time => ({
                label: time,
                value: time
              }))}
              onChange={(e) => setFormData({...formData, time: e.value})}
              placeholder={formData.date && formData.serviceId ? "Выберите время" : "Сначала выберите дату и услугу"}
              className={errors.time ? 'p-invalid w-full' : 'w-full'}
              disabled={!formData.date || !formData.serviceId || availableTimes.length === 0}
            />
            {errors.time && <small className="p-error">{errors.time}</small>}
            
            {formData.date && formData.serviceId && availableTimes.length === 0 && (
              <small className="p-error">
                Нет доступного времени для выбранной даты и услуги
              </small>
            )}
          </div>
          
          <Button
            label="Записаться"
            icon="pi pi-calendar-plus"
            onClick={handleSubmit}
            className="p-button-outlined"
            style={{ 
              background: 'white', 
              color: '#5a4a42', 
              borderColor: '#d9d3ce',
              marginTop: '1rem' 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;