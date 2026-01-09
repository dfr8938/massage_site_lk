// client/src/pages/AdminPanel.jsx
import { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import styles from './Home.module.css';

// === РАНДОМНЫЕ ФРАЗЫ ДЛЯ ПУСТЫХ ТАБЛИЦ === //
const getRandomMessage = (category) => {
  const messages = {
    pending: [
      'Пока нет записей на подтверждение.\nВсё спокойно — можно выпить чай.',
      'Никто не стучится в дверь.\nИ это прекрасно. Чай готов?',
      'Тишина — признак гармонии.\nА ещё — повод отдохнуть.',
      'Никаких запросов. Только тишина\nи аромат свежего чая.'
    ],
    confirmed: [
      'Пока нет подтверждённых записей.\nВсё идёт по плану.',
      'Никаких дел на завтра?\nЗначит, время для себя.',
      'Спокойствие — лучший график.\nНаслаждайтесь моментом.',
      'Пустой календарь — не пустая жизнь.\nПросто пауза перед новыми встречами.'
    ],
    services: [
      'Пока нет добавленных услуг.\nПридумайте что-то прекрасное.',
      'Услуги ещё не созданы.\nНо идеи уже рождаются?',
      'Пусто? Значит, самое время\nсоздать что-то уникальное.',
      'Здесь появятся ваши услуги.\nКогда вы будете готовы.'
    ],
    clients: [
      'Пока нет клиентов.\nНо они обязательно придут.',
      'Первый клиент уже где-то идёт к вам.\nПейте чай — он любит уют.',
      'Никаких имён в списке.\nЗато сколько возможностей!',
      'Клиенты приходят к тем,\nкто создаёт тепло. Вы — создаёте.'
    ],
    reviews: [
      'Пока нет отзывов.\nПервый точно будет тёплым.',
      'Тишина — не пустота.\nЭто место для будущих слов.',
      'Отзывы появятся, когда\nлюдям станет по-настоящему хорошо.',
      'Ещё никто не написал,\nно вы уже делаете чудо.'
    ]
  };
  const list = messages[category] || ['Всё спокойно.'];
  return list[Math.floor(Math.random() * list.length)];
};

// === АНИМИРОВАННОЕ СООБЩЕНИЕ ДЛЯ ПУСТЫХ ТАБЛИЦ === //
const AnimatedEmptyMessage = ({ category }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const message = getRandomMessage(category);

  return (
    <div className={styles.silenceBlock} style={{ margin: '2.5rem auto', padding: '2rem' }}>
      {visible && (
        <p>
          {message.split('\n').map((line, i) => (
            <span key={i} className="line">
              {line}
              <br />
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

// === Формат даты для фильтрации и отображения === //
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

const dateFilterApply = (value, filterValue) => {
  if (!filterValue) return true;
  return formatDate(value) === formatDate(filterValue);
};

// === Получение названия месяца === //
const getMonthName = (monthIndex) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[monthIndex];
};

const AdminPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);

  // --- Данные ---
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Анна К.', text: 'Прекрасный массаж, очень помог!', rating: 5, date: '2025-04-15', approved: false },
    { id: 2, name: 'Дмитрий П.', text: 'Хороший специалист, рекомендую.', rating: 5, date: '2025-04-08', approved: true }
  ]);

  const [pending, setPending] = useState([
    { id: 1, client: 'Анна К.', date: '2025-05-01 10:30', service: 'Классический массаж', status: 'Ожидание' },
    { id: 3, client: 'Мария Т.', date: '2025-05-03 16:00', service: 'Лечебный массаж', status: 'Ожидание' }
  ]);

  const [confirmed, setConfirmed] = useState([
    { id: 2, client: 'Олег С.', date: '2025-05-02 14:00', service: 'Лечебный массаж', status: 'Подтверждено' }
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'Классический массаж', price: 2500, duration: 60, active: true },
    { id: 2, name: 'Лечебный массаж', price: 3200, duration: 90, active: false }
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Анна К.', email: 'anna@example.com', phone: '+7 (916) 123-45-67', blocked: false },
    { id: 2, name: 'Олег С.', email: 'oleg@example.com', phone: '+7 (926) 222-33-44', blocked: true }
  ]);

  // --- Управление временем и датами ---
  const [blockedDates, setBlockedDates] = useState([
    new Date(2025, 0, 10), // 10.01.2025
    new Date(2025, 0, 15)  // 15.01.2025
  ]);

  const [blockedTimeSlots, setBlockedTimeSlots] = useState([
    { date: '2025-01-10', time: '12:00' },
    { date: '2025-01-10', time: '15:30' },
  ]);

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedTime, setNewBlockedTime] = useState('');

  // --- Финансы ---
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Аренда', amount: 15000, date: '2025-04-01' },
    { id: 2, name: 'Масло для массажа', amount: 3200, date: '2025-04-10' }
  ]);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: '' });
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // --- Состояния модалок ---
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editService, setEditService] = useState(null);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });

  const [clientDialog, setClientDialog] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const [reviewDialog, setReviewDialog] = useState(false);
  const [editReview, setEditReview] = useState(null);

  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);

  // === Функции ===

  // Отзывы
  const approveReview = (review) => {
    setReviews(reviews.map(r => r.id === review.id ? { ...r, approved: true } : r));
    toast.current.show({ severity: 'success', summary: 'Одобрено', detail: 'Отзыв опубликован' });
  };

  const rejectReview = (review) => {
    confirmDialog({
      message: 'Удалить этот отзыв?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setReviews(reviews.filter(r => r.id !== review.id));
        toast.current.show({ severity: 'warn', summary: 'Удалён', detail: 'Отзыв удалён' });
      }
    });
  };

  // Записи
  const confirmAppointment = (app) => {
    setPending(pending.filter(a => a.id !== app.id));
    setConfirmed([app, ...confirmed]);
    toast.current.show({ severity: 'success', summary: 'Подтверждено', detail: 'Запись подтверждена' });
  };

  const rejectAppointment = (app) => {
    confirmDialog({
      message: 'Отклонить эту запись?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setPending(pending.filter(a => a.id !== app.id));
        toast.current.show({ severity: 'info', summary: 'Отклонено', detail: 'Запись отклонена' });
      }
    });
  };

  // Услуги
  const toggleService = (service) => {
    setServices(services.map(s => s.id === service.id ? { ...s, active: !s.active } : s));
    toast.current.show({
      severity: 'info',
      summary: 'Статус изменён',
      detail: `Услуга "${service.name}" ${service.active ? 'скрыта' : 'показана'}`
    });
  };

  const confirmDeleteService = (service) => {
    confirmDialog({
      message: `Удалить услугу "${service.name}"?`,
      header: 'Удаление',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setServices(services.filter(s => s.id !== service.id));
        toast.current.show({ severity: 'warn', summary: 'Удалено', detail: 'Услуга удалена' });
      }
    });
  };

  // Клиенты
  const toggleBlock = (client) => {
    const action = client.blocked ? 'разблокировать' : 'заблокировать';
    confirmDialog({
      message: `Вы уверены, что хотите ${action} клиента?`,
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setClients(clients.map(c => c.id === client.id ? { ...c, blocked: !c.blocked } : c));
        toast.current.show({
          severity: 'info',
          summary: 'Статус изменён',
          detail: `Клиент ${client.blocked ? 'разблокирован' : 'заблокирован'}`
        });
      }
    });
  };

  const confirmDeleteClient = (client) => {
    confirmDialog({
      message: `Удалить клиента "${client.name}"?`,
      header: 'Удаление',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setClients(clients.filter(c => c.id !== client.id));
        toast.current.show({ severity: 'warn', summary: 'Удалён', detail: 'Клиент удалён' });
      }
    });
  };

  // Редактирование: Услуга
  const openNewService = () => {
    setNewService({ name: '', price: '', duration: '' });
    setServiceDialog(true);
  };

  const editServiceOpen = (service) => {
    setEditService({ ...service });
    setServiceDialog(true);
  };

  const saveService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Заполните все поля' });
      return;
    }
    const service = {
      id: services.length + 1,
      name: newService.name,
      price: parseInt(newService.price),
      duration: parseInt(newService.duration),
      active: true
    };
    setServices([service, ...services]);
    setServiceDialog(false);
    toast.current.show({ severity: 'success', summary: 'Добавлено', detail: 'Услуга добавлена' });
  };

  const saveEditedService = () => {
    setServices(services.map(s => s.id === editService.id ? { ...editService } : s));
    setServiceDialog(false);
    setEditService(null);
    toast.current.show({ severity: 'success', summary: 'Обновлено', detail: 'Услуга обновлена' });
  };

  // Редактирование: Клиент
  const editClientOpen = (client) => {
    setEditClient({ ...client });
    setClientDialog(true);
  };

  const saveClient = () => {
    setClients(clients.map(c => c.id === editClient.id ? { ...editClient } : c));
    setClientDialog(false);
    setEditClient(null);
    toast.current.show({ severity: 'success', summary: 'Обновлено', detail: 'Клиент сохранён' });
  };

  // Редактирование: Отзыв
  const editReviewOpen = (review) => {
    setEditReview({ ...review });
    setReviewDialog(true);
  };

  const saveEditedReview = () => {
    setReviews(reviews.map(r => r.id === editReview.id ? { ...editReview } : r));
    setReviewDialog(false);
    setEditReview(null);
    toast.current.show({ severity: 'success', summary: 'Обновлено', detail: 'Отзыв отредактирован' });
  };

  // Редактирование: Запись
  const editAppointmentOpen = (app) => {
    setEditAppointment({ ...app });
    setAppointmentDialog(true);
  };

  const saveEditedAppointment = () => {
    setPending(pending.map(a => a.id === editAppointment.id ? { ...editAppointment } : a));
    setAppointmentDialog(false);
    setEditAppointment(null);
    toast.current.show({ severity: 'success', summary: 'Обновлено', detail: 'Запись отредактирована' });
  };

  // === Финансы: Получение данных ===
  const getFinancialData = () => {
    const year = selectedYear;

    // Доходы из подтверждённых записей
    const incomeRecords = confirmed.map(app => {
      const service = services.find(s => s.name === app.service);
      const date = new Date(app.date);
      return {
        date,
        amount: service?.price || 0,
        type: 'income',
        desc: `${app.service} — ${app.client}`
      };
    });

    // Расходы
    const expenseRecords = expenses
      .filter(e => new Date(e.date).getFullYear() === year)
      .map(e => ({
        date: new Date(e.date),
        amount: e.amount,
        type: 'expense',
        desc: e.name
      }));

    const allRecords = [...incomeRecords, ...expenseRecords].filter(r => r.date.getFullYear() === year);

    // Группировка по периодам
    const months = Array.from({ length: 12 }, (_, i) => ({ label: getMonthName(i), income: 0, expense: 0 }));
    const quarters = Array.from({ length: 4 }, (_, i) => ({ label: `Q${i + 1}`, income: 0, expense: 0 }));
    const halves = Array.from({ length: 2 }, (_, i) => ({ label: `${i + 1} полугодие`, income: 0, expense: 0 }));
    let yearTotal = { income: 0, expense: 0 };

    allRecords.forEach(r => {
      const monthIdx = r.date.getMonth();
      const quarterIdx = Math.floor(monthIdx / 3);
      const halfIdx = Math.floor(monthIdx / 6);

      if (r.type === 'income') {
        months[monthIdx].income += r.amount;
        quarters[quarterIdx].income += r.amount;
        halves[halfIdx].income += r.amount;
        yearTotal.income += r.amount;
      } else {
        months[monthIdx].expense += r.amount;
        quarters[quarterIdx].expense += r.amount;
        halves[halfIdx].expense += r.amount;
        yearTotal.expense += r.amount;
      }
    });

    return { months, quarters, halves, yearTotal };
  };

  const { months, quarters, halves, yearTotal } = getFinancialData();

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.date) {
      toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Заполните все поля' });
      return;
    }
    const expense = {
      id: expenses.length + 1,
      name: newExpense.name,
      amount: parseInt(newExpense.amount),
      date: newExpense.date
    };
    setExpenses([expense, ...expenses]);
    setExpenseDialog(false);
    setNewExpense({ name: '', amount: '', date: '' });
    toast.current.show({ severity: 'success', summary: 'Расход добавлен', detail: `${expense.name} — ${expense.amount} ₽` });
  };

  const deleteExpense = (expense) => {
    confirmDialog({
      message: `Удалить расход "${expense.name}"?`,
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setExpenses(expenses.filter(e => e.id !== expense.id));
        toast.current.show({ severity: 'warn', summary: 'Удалён', detail: 'Расход удалён' });
      }
    });
  };

  // === Тела колонок ===
  const statusBodyTemplate = (rowData) => (
    <span
      className="inline-flex align-items-center px-3 py-1 rounded text-sm font-semibold"
      style={{
        background: rowData.active
          ? 'linear-gradient(90deg, #f0f7f4, #e6f4e8)'
          : 'linear-gradient(90deg, #fdf5f5, #fdecec)',
        color: rowData.active ? '#1a6b3a' : '#992a2a',
        border: '1px solid',
        borderColor: rowData.active ? '#b8e0c0' : '#f5c6c6',
        fontWeight: 500
      }}
    >
      {rowData.active ? 'Активна' : 'Скрыта'}
    </span>
  );

  const statusBodyTemplateClients = (rowData) => (
    <span
      className="inline-flex align-items-center px-3 py-1 rounded text-sm font-semibold"
      style={{
        background: rowData.blocked
          ? 'linear-gradient(90deg, #fdf5f5, #fdecec)'
          : 'linear-gradient(90deg, #f0f7f4, #e6f4e8)',
        color: rowData.blocked ? '#992a2a' : '#1a6b3a',
        border: '1px solid',
        borderColor: rowData.blocked ? '#f5c6c6' : '#b8e0c0',
        fontWeight: 500
      }}
    >
      {rowData.blocked ? 'Заблокирован' : 'Активен'}
    </span>
  );

  const actionBodyTemplateReviews = (rowData) => (
    <div className="flex gap-2">
      {!rowData.approved && (
        <Button icon="pi pi-check" severity="success" rounded tooltip="Одобрить" onClick={() => approveReview(rowData)} />
      )}
      <Button icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" onClick={() => rejectReview(rowData)} />
      <Button icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" onClick={() => editReviewOpen(rowData)} />
    </div>
  );

  const actionBodyTemplatePending = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-check" severity="success" rounded tooltip="Подтвердить" onClick={() => confirmAppointment(rowData)} />
      <Button icon="pi pi-times" severity="danger" rounded tooltip="Отклонить" onClick={() => rejectAppointment(rowData)} />
      <Button icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" onClick={() => editAppointmentOpen(rowData)} />
    </div>
  );

  const actionBodyTemplateConfirmed = (rowData) => (
    <Button
      label="Вернуть"
      icon="pi pi-undo"
      severity="secondary"
      size="small"
      onClick={() => {
        setConfirmed(confirmed.filter(a => a.id !== rowData.id));
        setPending([rowData, ...pending]);
        toast.current.show({ severity: 'info', summary: 'Возвращено', detail: 'Запись возвращена' });
      }}
    />
  );

  const actionBodyTemplateClients = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" severity="warning" rounded tooltip="Редактировать" onClick={() => editClientOpen(rowData)} />
      <Button
        icon={rowData.blocked ? 'pi pi-lock-open' : 'pi pi-lock'}
        severity={rowData.blocked ? 'success' : 'danger'}
        rounded
        tooltip={rowData.blocked ? 'Разблокировать' : 'Заблокировать'}
        onClick={() => toggleBlock(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        tooltip="Удалить"
        onClick={() => confirmDeleteClient(rowData)}
      />
    </div>
  );

  const actionBodyTemplateExpenses = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" severity="info" rounded onClick={() => {
        setNewExpense({ ...rowData });
        setExpenseDialog(true);
      }} />
      <Button icon="pi pi-trash" severity="danger" rounded onClick={() => deleteExpense(rowData)} />
    </div>
  );

  const totalBodyTemplate = (rowData) => (
    <span style={{ fontWeight: 'bold', color: '#5a4a42' }}>
      {(rowData.income - rowData.expense).toLocaleString()} ₽
    </span>
  );

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <h2 className={styles.header}>
        <span className={styles['title-reveal']} data-text="Админ-панель">
          Админ-панель
        </span>
      </h2>
      <p className={styles.subheader}>Управление бизнесом с душой и порядком</p>

      <div className={styles.dividerBlock}></div>

      {/* === УПРАВЛЕНИЕ ВКЛАДКАМИ СО СТРЕЛКАМИ === */}
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
            'На подтверждении',
            'Подтверждённые',
            'Услуги',
            'Клиенты',
            'Отзывы',
            'Время и даты',
            'Финансы'
          ][activeIndex]}
        </div>
        <Button
          icon="pi pi-angle-right"
          className="p-button-text p-button-rounded"
          disabled={activeIndex === 6}
          onClick={() => setActiveIndex(activeIndex + 1)}
          aria-label="Следующая вкладка"
          style={{ color: '#5a4a42' }}
        />
      </div>

      {/* === ОТРИСОВКА АКТИВНОЙ ВКЛАДКИ === */}
      <div className="card p-4" style={{ background: '#f9f6f3', borderRadius: '12px' }}>
        {activeIndex === 0 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-clock mr-2"></i>На подтверждении
            </h4>
            <DataTable
              value={pending}
              emptyMessage={<AnimatedEmptyMessage category="pending" />}
              paginator
              rows={10}
              sortMode="single"
              sortField="date"
              sortOrder={-1}
              filters={{
                date: { value: null, matchMode: 'custom', getMatch: (value, filter) => dateFilterApply(value, filter) }
              }}
              globalFilterFields={['client', 'service']}
            >
              <Column
                field="date"
                header="Дата"
                sortable
                filter
                filterElement={(options) => (
                  <Calendar
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    placeholder="Выберите дату"
                    showIcon
                    dateFormat="yy-mm-dd"
                    style={{ width: '100%' }}
                    inputClassName="p-2"
                  />
                )}
                body={(rowData) => new Date(rowData.date).toLocaleString('ru-RU')}
              />
              <Column
                field="client"
                header="Клиент"
                sortable
                filter
                filterPlaceholder="Поиск..."
              />
              <Column
                field="service"
                header="Услуга"
                sortable
                filter
                filterPlaceholder="Поиск..."
                body={(rowData) => {
                  const service = services.find(s => s.name === rowData.service);
                  return (
                    <div>
                      <div>{rowData.service}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {service ? `${service.price} ₽` : '—'}
                      </div>
                    </div>
                  );
                }}
              />
              <Column
                header="Цена (₽)"
                body={(rowData) => {
                  const service = services.find(s => s.name === rowData.service);
                  return <span style={{ fontWeight: 500 }}>{service?.price.toLocaleString() || '—'}</span>;
                }}
                sortable
                style={{ textAlign: 'right' }}
              />
              <Column body={actionBodyTemplatePending} header="Действия" align="center" />
            </DataTable>
          </div>
        )}

        {activeIndex === 1 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-check-circle mr-2"></i>Подтверждённые
            </h4>
            <DataTable
              value={confirmed}
              emptyMessage={<AnimatedEmptyMessage category="confirmed" />}
              paginator
              rows={10}
              sortMode="single"
              sortField="date"
              sortOrder={-1}
              filters={{
                date: { value: null, matchMode: 'custom', getMatch: (value, filter) => dateFilterApply(value, filter) }
              }}
              globalFilterFields={['client', 'service']}
            >
              <Column
                field="date"
                header="Дата"
                sortable
                filter
                filterElement={(options) => (
                  <Calendar
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    placeholder="Выберите дату"
                    showIcon
                    dateFormat="yy-mm-dd"
                    style={{ width: '100%' }}
                    inputClassName="p-2"
                  />
                )}
                body={(rowData) => new Date(rowData.date).toLocaleString('ru-RU')}
              />
              <Column
                field="client"
                header="Клиент"
                sortable
                filter
                filterPlaceholder="Поиск..."
              />
              <Column
                field="service"
                header="Услуга"
                sortable
                filter
                filterPlaceholder="Поиск..."
                body={(rowData) => {
                  const service = services.find(s => s.name === rowData.service);
                  return (
                    <div>
                      <div>{rowData.service}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {service ? `${service.price} ₽` : '—'}
                      </div>
                    </div>
                  );
                }}
              />
              <Column
                header="Цена (₽)"
                body={(rowData) => {
                  const service = services.find(s => s.name === rowData.service);
                  return <span style={{ fontWeight: 500 }}>{service?.price.toLocaleString() || '—'}</span>;
                }}
                sortable
                style={{ textAlign: 'right' }}
              />
              <Column body={actionBodyTemplateConfirmed} header="Действия" />
            </DataTable>
          </div>
        )}

        {activeIndex === 2 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-briefcase mr-2"></i>Услуги
            </h4>
            <div className="flex justify-content-end mb-3">
              <Button
                label="Добавить услугу"
                icon="pi pi-plus"
                onClick={openNewService}
                className={styles['gradient-button']}
              />
            </div>
            <DataTable
              value={services}
              emptyMessage={<AnimatedEmptyMessage category="services" />}
              paginator
              rows={10}
              sortMode="single"
              sortField="name"
              sortOrder={1}
            >
              <Column field="name" header="Название" sortable />
              <Column field="price" header="Цена (₽)" sortable />
              <Column field="duration" header="Длительность (мин)" sortable />
              <Column body={statusBodyTemplate} header="Статус" />
              <Column
                body={(rowData) => (
                  <div className="flex gap-2">
                    <Button icon="pi pi-pencil" severity="warning" rounded onClick={() => editServiceOpen(rowData)} />
                    <Button
                      icon={rowData.active ? 'pi pi-eye-slash' : 'pi pi-eye'}
                      severity={rowData.active ? 'danger' : 'success'}
                      rounded
                      onClick={() => toggleService(rowData)}
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      rounded
                      onClick={() => confirmDeleteService(rowData)}
                    />
                  </div>
                )}
                header="Действия"
                align="center"
              />
            </DataTable>
          </div>
        )}

        {activeIndex === 3 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-users mr-2"></i>Клиенты
            </h4>
            <DataTable
              value={clients}
              emptyMessage={<AnimatedEmptyMessage category="clients" />}
              paginator
              rows={10}
              sortMode="single"
              sortField="name"
              sortOrder={1}
            >
              <Column field="name" header="Имя" sortable />
              <Column field="email" header="Email" sortable />
              <Column field="phone" header="Телефон" sortable />
              <Column body={statusBodyTemplateClients} header="Статус" />
              <Column body={actionBodyTemplateClients} header="Действия" align="center" />
            </DataTable>
          </div>
        )}

        {activeIndex === 4 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-comments mr-2"></i>Отзывы
            </h4>
            <DataTable
              value={reviews}
              emptyMessage={<AnimatedEmptyMessage category="reviews" />}
              paginator
              rows={10}
              sortMode="single"
              sortField="date"
              sortOrder={-1}
              filters={{
                date: { value: null, matchMode: 'custom', getMatch: (value, filter) => dateFilterApply(value, filter) }
              }}
              globalFilterFields={['name', 'text']}
            >
              <Column
                field="date"
                header="Дата"
                sortable
                filter
                filterElement={(options) => (
                  <Calendar
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    placeholder="Выберите дату"
                    showIcon
                    dateFormat="yy-mm-dd"
                    style={{ width: '100%' }}
                    inputClassName="p-2"
                  />
                )}
                body={(rowData) => new Date(rowData.date).toLocaleDateString('ru-RU')}
              />
              <Column field="name" header="Имя" sortable filter filterPlaceholder="Поиск..." />
              <Column field="text" header="Текст" filter filterPlaceholder="Поиск..." />
              <Column body={(rowData) => <Rating value={rowData.rating} readOnly cancel={false} />} header="Оценка" />
              <Column
                body={(rowData) => (
                  <span className={`inline-flex px-2 py-1 rounded text-sm font-semibold ${rowData.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {rowData.approved ? 'Опубликован' : 'На модерации'}
                  </span>
                )}
                header="Статус"
              />
              <Column body={actionBodyTemplateReviews} header="Действия" align="center" />
            </DataTable>
          </div>
        )}

        {activeIndex === 5 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
              <i className="pi pi-calendar-times mr-2"></i>Время и даты
            </h4>
            <div className="flex flex-column gap-5">
              {/* === Блокировка целых дней === */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: 500,
                    color: '#5a4a42',
                    fontSize: '1.05rem'
                  }}
                >
                  🔒 Полная блокировка дней
                </label>
                <div style={{ marginTop: '0.5rem' }}>
                  {blockedDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2" style={{ padding: '0.5rem 0' }}>
                      {blockedDates.map((date, index) => {
                        const displayDate = new Date(date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        });
                        return (
                          <div
                            key={index}
                            className="flex align-items-center gap-2"
                            style={{
                              background: '#fdf5f5',
                              border: '1px solid #f5c6c6',
                              borderRadius: '8px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.95rem',
                              color: '#992a2a',
                              fontWeight: 500,
                              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          >
                            <span>{displayDate}</span>
                            <Button
                              icon="pi pi-times"
                              severity="danger"
                              rounded
                              text
                              size="small"
                              style={{ marginLeft: '0.5rem' }}
                              onClick={() => {
                                confirmDialog({
                                  message: `Вы уверены, что хотите разблокировать день ${displayDate}?`,
                                  header: 'Подтверждение',
                                  icon: 'pi pi-exclamation-triangle',
                                  accept: () => {
                                    setBlockedDates(blockedDates.filter((_, i) => i !== index));
                                    toast.current.show({
                                      severity: 'info',
                                      summary: 'Разблокировано',
                                      detail: displayDate
                                    });
                                  },
                                  reject: () => {
                                    toast.current.show({
                                      severity: 'secondary',
                                      summary: 'Отменено',
                                      detail: 'Осталось заблокированным'
                                    });
                                  }
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '1rem',
                        background: '#f1ede8',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        color: '#777',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}
                    >
                      Нет заблокированных дней
                    </div>
                  )}
                </div>

                {/* === Добавление дня === */}
                <div className="flex gap-2 mt-3">
                  <Calendar
                    value={null}
                    onChange={(e) => {
                      const selectedDate = e.value;
                      if (!selectedDate) return;

                      const year = selectedDate.getFullYear();
                      const month = selectedDate.getMonth();
                      const day = selectedDate.getDate();
                      const localDate = new Date(year, month, day);

                      const alreadyExists = blockedDates.some(d => {
                        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
                      });

                      if (alreadyExists) {
                        toast.current.show({
                          severity: 'warn',
                          summary: 'Уже заблокировано',
                          detail: 'Этот день уже в списке'
                        });
                        return;
                      }

                      setBlockedDates([...blockedDates, localDate]);
                      toast.current.show({
                        severity: 'success',
                        summary: 'День заблокирован',
                        detail: localDate.toLocaleDateString('ru-RU')
                      });
                    }}
                    placeholder="Выберите дату"
                    style={{ width: '70%' }}
                    dateFormat="dd.mm.yy"
                    showIcon
                    selectionMode="single"
                    minDate={new Date()}
                    inputStyle={{
                      height: '42px',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #cfc9c2',
                      fontSize: '1rem',
                      color: '#5a4a42',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* === Блокировка временных слотов === */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: 500,
                    color: '#5a4a42',
                    fontSize: '1.05rem'
                  }}
                >
                  ⏳ Блокировка временных слотов
                </label>

                {/* === Форма добавления слота (наверх!) === */}
                <div
                  className="flex flex-column gap-3 mb-4"
                  style={{
                    padding: '1.2rem',
                    background: '#f8f4f0',
                    borderRadius: '12px',
                    border: '1px dashed #d9d3ce',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                  }}
                >
                  <div className="flex gap-3 flex-wrap align-items-end">
                    {/* Календарь */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem', color: '#5a4a42' }}>
                        Дата
                      </label>
                      <Calendar
                        value={newBlockedDate ? new Date(newBlockedDate + 'T00:00') : null}
                        onChange={(e) => {
                          if (e.value) {
                            const year = e.value.getFullYear();
                            const month = String(e.value.getMonth() + 1).padStart(2, '0');
                            const day = String(e.value.getDate()).padStart(2, '0');
                            const localDateStr = `${year}-${month}-${day}`;
                            setNewBlockedDate(localDateStr);
                          }
                        }}
                        placeholder="Выберите"
                        dateFormat="dd.mm.yy"
                        showIcon
                        selectionMode="single"
                        panelStyle={{ width: '22rem', borderRadius: '12px' }}
                        hourFormat="24"
                        minDate={new Date()}
                        style={{ width: '100%' }}
                        inputStyle={{
                          height: '42px',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid #cfc9c2',
                          fontSize: '1rem',
                          color: '#5a4a42',
                          background: '#ffffff'
                        }}
                      />
                    </div>

                    {/* Время */}
                    <div style={{ flex: '1', minWidth: '180px' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem', color: '#5a4a42' }}>
                        Время
                      </label>
                      <Dropdown
                        value={newBlockedTime}
                        onChange={(e) => setNewBlockedTime(e.value)}
                        options={[
                          '09:00', '09:30', '10:00', '10:30',
                          '11:00', '11:30', '12:00', '12:30',
                          '13:00', '13:30', '14:00', '14:30',
                          '15:00', '15:30', '16:00', '16:30',
                          '17:00', '17:30', '18:00', '18:30',
                          '19:00', '19:30', '20:00', '20:30', '21:00'
                        ]}
                        placeholder="Выберите"
                        style={{ width: '100%' }}
                        inputStyle={{
                          height: '42px',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid #cfc9c2',
                          fontSize: '1rem',
                          color: '#5a4a42',
                          background: '#ffffff'
                        }}
                      />
                    </div>

                    {/* Кнопка добавить */}
                    <Button
                      label="Добавить"
                      icon="pi pi-plus"
                      onClick={() => {
                        if (!newBlockedDate || !newBlockedTime) {
                          toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Выберите дату и время' });
                          return;
                        }
                        const newSlot = { date: newBlockedDate, time: newBlockedTime };
                        if (blockedTimeSlots.some(slot => slot.date === newSlot.date && slot.time === newSlot.time)) {
                          toast.current.show({ severity: 'warn', summary: 'Уже есть', detail: 'Этот слот уже заблокирован' });
                          return;
                        }
                        setBlockedTimeSlots([...blockedTimeSlots, newSlot]);
                        setNewBlockedDate('');
                        setNewBlockedTime('');
                        toast.current.show({ severity: 'success', summary: 'Заблокировано', detail: `${newSlot.date} ${newSlot.time}` });
                      }}
                      className="p-button-outlined"
                      style={{
                        height: '42px',
                        padding: '0.6rem 1rem',
                        background: '#fff',
                        color: '#5a4a42',
                        borderColor: '#d9d3ce',
                        fontSize: '0.95rem',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* === Таблица заблокированных слотов === */}
                <div className="mt-2">
                  <DataTable
                    value={blockedTimeSlots}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10]}
                    emptyMessage="Нет заблокированных слотов"
                    style={{
                      fontSize: '0.95rem',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}
                    tableStyle={{
                      background: '#fffaf7',
                      borderRadius: '10px'
                    }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="{first}–{last} из {totalRecords}"
                  >
                    <Column
                      field="date"
                      header="Дата"
                      body={(rowData) => (
                        <span style={{ fontWeight: 500, color: '#5a4a42' }}>
                          {new Date(rowData.date).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                      style={{ fontWeight: 500 }}
                    />
                    <Column
                      field="time"
                      header="Время"
                      body={(rowData) => (
                        <span
                          style={{
                            fontWeight: 600,
                            color: '#1a5d6e',
                            background: '#e6f4f7',
                            padding: '0.3rem 0.7rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                          }}
                        >
                          {rowData.time}
                        </span>
                      )}
                    />
                    <Column
                      header="Действия"
                      body={(rowData) => (
                        <Button
                          icon="pi pi-trash"
                          severity="danger"
                          size="small"
                          outlined
                          style={{
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.85rem'
                          }}
                          onClick={() => {
                            confirmDialog({
                              message: `Разблокировать слот на ${rowData.date} в ${rowData.time}?`,
                              header: 'Подтверждение',
                              icon: 'pi pi-exclamation-triangle',
                              accept: () => {
                                setBlockedTimeSlots(blockedTimeSlots.filter(
                                  slot => !(slot.date === rowData.date && slot.time === rowData.time)
                                ));
                                toast.current.show({ severity: 'info', summary: 'Разблокировано', detail: `${rowData.date} ${rowData.time}` });
                              },
                              reject: () => {
                                toast.current.show({ severity: 'secondary', summary: 'Отмена', detail: 'Слот остался' });
                              }
                            });
                          }}
                        />
                      )}
                      align="center"
                    />
                  </DataTable>
                </div>
              </div>

              {/* === Кнопка сохранить === */}
              <div className="flex justify-content-end mt-5">
                <Button
                  label="Сохранить настройки"
                  icon="pi pi-save"
                  className={styles['gradient-button']}
                  style={{
                    fontSize: '1.05rem',
                    padding: '0.7rem 1.4rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                  onClick={() => {
                    toast.current.show({
                      severity: 'success',
                      summary: 'Готово',
                      detail: 'Настройки сохранены'
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeIndex === 6 && (
          <div>
            <h4 style={{ color: '#5a4a42', marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.3rem' }}>
              <i className="pi pi-chart-line mr-2"></i>Финансы
            </h4>

            {/* === Фильтр по году === */}
            <div className="flex align-items-center gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 500, color: '#5a4a42' }}>Год:</label>
              <Dropdown
                value={selectedYear}
                options={Array.from({ length: 10 }, (_, i) => 2020 + i)}
                onChange={(e) => setSelectedYear(e.value)}
                style={{ width: '120px', borderRadius: '8px' }}
                inputStyle={{ padding: '0.5rem' }}
              />
            </div>

            {/* === Общие итоги === */}
            <div className="grid mb-6">
              <div className="col-12 md:col-6 lg:col-3 p-4">
                <div style={{
                  background: '#e6f7e8', borderRadius: '10px', padding: '1rem',
                  textAlign: 'center', border: '1px solid #b8e0c0'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#1a6b3a', marginBottom: '0.3rem' }}>Доходы</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1a6b3a' }}>
                    {yearTotal.income.toLocaleString()} ₽
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 p-4">
                <div style={{
                  background: '#fff0f0', borderRadius: '10px', padding: '1rem',
                  textAlign: 'center', border: '1px solid #f5c6c6'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#992a2a', marginBottom: '0.3rem' }}>Расходы</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#992a2a' }}>
                    {yearTotal.expense.toLocaleString()} ₽
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 p-4">
                <div style={{
                  background: '#f0f7ff', borderRadius: '10px', padding: '1rem',
                  textAlign: 'center', border: '1px solid #b3d9ff'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#0066cc', marginBottom: '0.3rem' }}>Прибыль</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0066cc' }}>
                    {(yearTotal.income - yearTotal.expense).toLocaleString()} ₽
                  </div>
                </div>
              </div>
            </div>

            {/* === Таблицы по периодам === */}
            <div className="grid">
              <div className="col-12">
                <h5 style={{ color: '#5a4a42', fontWeight: 500, marginBottom: '1rem' }}>По месяцам</h5>
                <DataTable value={months} size="small">
                  <Column field="label" header="Месяц" style={{ fontWeight: 500 }} />
                  <Column field="income" header="Доход (₽)" body={(r) => r.income.toLocaleString()} />
                  <Column field="expense" header="Расход (₽)" body={(r) => r.expense.toLocaleString()} />
                  <Column header="Прибыль (₽)" body={totalBodyTemplate} style={{ fontWeight: 'bold' }} />
                </DataTable>
              </div>

              <div className="col-12 mt-5">
                <h5 style={{ color: '#5a4a42', fontWeight: 500, marginBottom: '1rem' }}>По кварталам</h5>
                <DataTable value={quarters} size="small">
                  <Column field="label" header="Квартал" style={{ fontWeight: 500 }} />
                  <Column field="income" header="Доход (₽)" body={(r) => r.income.toLocaleString()} />
                  <Column field="expense" header="Расход (₽)" body={(r) => r.expense.toLocaleString()} />
                  <Column header="Прибыль (₽)" body={totalBodyTemplate} style={{ fontWeight: 'bold' }} />
                </DataTable>
              </div>

              <div className="col-12 mt-5">
                <h5 style={{ color: '#5a4a42', fontWeight: 500, marginBottom: '1rem' }}>По полугодиям</h5>
                <DataTable value={halves} size="small">
                  <Column field="label" header="Период" style={{ fontWeight: 500 }} />
                  <Column field="income" header="Доход (₽)" body={(r) => r.income.toLocaleString()} />
                  <Column field="expense" header="Расход (₽)" body={(r) => r.expense.toLocaleString()} />
                  <Column header="Прибыль (₽)" body={totalBodyTemplate} style={{ fontWeight: 'bold' }} />
                </DataTable>
              </div>
            </div>

            {/* === Управление расходами === */}
            <div className="mt-6">
              <div className="flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: '#5a4a42', fontWeight: 500, margin: 0 }}>Расходы</h5>
                <Button
                  label="Добавить расход"
                  icon="pi pi-plus"
                  size="small"
                  onClick={() => {
                    setNewExpense({ name: '', amount: '', date: '' });
                    setExpenseDialog(true);
                  }}
                  className="p-button-outlined"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <DataTable
                value={expenses.filter(e => new Date(e.date).getFullYear() === selectedYear)}
                paginator
                rows={5}
                emptyMessage="Нет расходов"
                size="small"
              >
                <Column field="name" header="Наименование" />
                <Column field="amount" header="Сумма (₽)" body={(e) => e.amount.toLocaleString()} />
                <Column field="date" header="Дата" body={(e) => new Date(e.date).toLocaleDateString('ru-RU')} />
                <Column body={actionBodyTemplateExpenses} header="Действия" align="center" />
              </DataTable>
            </div>
          </div>
        )}
      </div>

      {/* === МОДАЛКА: Услуга === */}
      <Dialog
        visible={serviceDialog}
        style={{ width: '450px' }}
        header={editService ? 'Редактировать услугу' : 'Новая услуга'}
        modal
        className="p-fluid"
        dismissableMask
        closable
        footer={
          <div>
            <Button
              label="Отмена"
              icon="pi pi-times"
              text
              onClick={() => { setServiceDialog(false); setEditService(null); }}
              style={{ color: '#5a4a42', marginRight: 'auto' }}
            />
            <Button
              label="Сохранить"
              icon="pi pi-check"
              onClick={editService ? saveEditedService : saveService}
              className={styles['gradient-button']}
            />
          </div>
        }
        onHide={() => { setServiceDialog(false); setEditService(null); }}
        pt={{ root: { className: 'fade-in-up' } }}
      >
        <div className="p-4">
          <div className="field">
            <label htmlFor="name">Название</label>
            <InputText
              id="name"
              value={editService?.name || newService.name}
              onChange={(e) => editService
                ? setEditService({ ...editService, name: e.target.value })
                : setNewService({ ...newService, name: e.target.value })
              }
              required
            />
          </div>
          <div className="field">
            <label htmlFor="price">Цена (₽)</label>
            <InputText
              id="price"
              type="number"
              value={editService?.price || newService.price}
              onChange={(e) => editService
                ? setEditService({ ...editService, price: e.target.value })
                : setNewService({ ...newService, price: e.target.value })
              }
              required
            />
          </div>
          <div className="field">
            <label htmlFor="duration">Длительность (мин)</label>
            <InputText
              id="duration"
              type="number"
              value={editService?.duration || newService.duration}
              onChange={(e) => editService
                ? setEditService({ ...editService, duration: e.target.value })
                : setNewService({ ...newService, duration: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className={styles.dividerBlock}></div>
      </Dialog>

      {/* === МОДАЛКА: Клиент === */}
      <Dialog
        visible={clientDialog}
        style={{ width: '450px' }}
        header="Редактировать клиента"
        modal
        className="p-fluid"
        dismissableMask
        closable
        footer={
          <div>
            <Button
              label="Отмена"
              icon="pi pi-times"
              text
              onClick={() => setClientDialog(false)}
              style={{ color: '#5a4a42', marginRight: 'auto' }}
            />
            <Button
              label="Сохранить"
              icon="pi pi-check"
              onClick={saveClient}
              className={styles['gradient-button']}
            />
          </div>
        }
        onHide={() => setClientDialog(false)}
        pt={{ root: { className: 'fade-in-up' } }}
      >
        <div className="p-4">
          <div className="field">
            <label htmlFor="clientName">Имя</label>
            <InputText
              id="clientName"
              value={editClient?.name || ''}
              onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={editClient?.email || ''}
              onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Телефон</label>
            <InputText
              id="phone"
              value={editClient?.phone || ''}
              onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.dividerBlock}></div>
      </Dialog>

      {/* === МОДАЛКА: Отзыв === */}
      <Dialog
        visible={reviewDialog}
        style={{ width: '500px' }}
        header="Редактировать отзыв"
        modal
        className="p-fluid"
        dismissableMask
        closable
        footer={
          <div>
            <Button
              label="Отмена"
              icon="pi pi-times"
              text
              onClick={() => setReviewDialog(false)}
              style={{ color: '#5a4a42', marginRight: 'auto' }}
            />
            <Button
              label="Сохранить"
              icon="pi pi-check"
              onClick={saveEditedReview}
              className={styles['gradient-button']}
            />
          </div>
        }
        onHide={() => setReviewDialog(false)}
        pt={{ root: { className: 'fade-in-up' } }}
      >
        <div className="p-4">
          <div className="field">
            <label htmlFor="reviewName">Имя</label>
            <InputText
              id="reviewName"
              value={editReview?.name || ''}
              onChange={(e) => setEditReview({ ...editReview, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reviewText">Текст</label>
            <InputText
              id="reviewText"
              value={editReview?.text || ''}
              onChange={(e) => setEditReview({ ...editReview, text: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reviewRating">Оценка</label>
            <Rating
              id="reviewRating"
              value={editReview?.rating || 5}
              onChange={(e) => setEditReview({ ...editReview, rating: e.value })}
              cancel={false}
            />
          </div>
        </div>
        <div className={styles.dividerBlock}></div>
      </Dialog>

      {/* === МОДАЛКА: Запись === */}
      <Dialog
        visible={appointmentDialog}
        style={{ width: '500px' }}
        header="Редактировать запись"
        modal
        className="p-fluid"
        dismissableMask
        closable
        footer={
          <div>
            <Button
              label="Отмена"
              icon="pi pi-times"
              text
              onClick={() => setAppointmentDialog(false)}
              style={{ color: '#5a4a42', marginRight: 'auto' }}
            />
            <Button
              label="Сохранить"
              icon="pi pi-check"
              onClick={saveEditedAppointment}
              className={styles['gradient-button']}
            />
          </div>
        }
        onHide={() => setAppointmentDialog(false)}
        pt={{ root: { className: 'fade-in-up' } }}
      >
        <div className="p-4">
          <div className="field">
            <label htmlFor="appointmentClient">Клиент</label>
            <InputText
              id="appointmentClient"
              value={editAppointment?.client || ''}
              onChange={(e) => setEditAppointment({ ...editAppointment, client: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="appointmentDate">Дата и время</label>
            <InputText
              id="appointmentDate"
              value={editAppointment?.date || ''}
              onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
              required
              placeholder="2025-05-01 10:30"
            />
          </div>
          <div className="field">
            <label htmlFor="appointmentService">Услуга</label>
            <InputText
              id="appointmentService"
              value={editAppointment?.service || ''}
              onChange={(e) => setEditAppointment({ ...editAppointment, service: e.target.value })}
              required
            />
          </div>
        </div>
        <div className={styles.dividerBlock}></div>
      </Dialog>

      {/* === МОДАЛКА: Расход === */}
      <Dialog
        visible={expenseDialog}
        style={{ width: '450px' }}
        header={newExpense.id ? 'Редактировать расход' : 'Новый расход'}
        modal
        className="p-fluid"
        closable
        footer={
          <div>
            <Button
              label="Отмена"
              icon="pi pi-times"
              text
              onClick={() => setExpenseDialog(false)}
              style={{ color: '#5a4a42', marginRight: 'auto' }}
            />
            <Button
              label="Сохранить"
              icon="pi pi-check"
              onClick={addExpense}
              className={styles['gradient-button']}
            />
          </div>
        }
        onHide={() => setExpenseDialog(false)}
      >
        <div className="p-4">
          <div className="field">
            <label htmlFor="expenseName">Наименование</label>
            <InputText
              id="expenseName"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="expenseAmount">Сумма (₽)</label>
            <InputText
              id="expenseAmount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="expenseDate">Дата</label>
            <Calendar
              id="expenseDate"
              value={newExpense.date ? new Date(newExpense.date) : null}
              onChange={(e) => setNewExpense({ ...newExpense, date: formatDate(e.value) })}
              dateFormat="yy-mm-dd"
              showIcon
              required
            />
          </div>
        </div>
        <div className={styles.dividerBlock}></div>
      </Dialog>
    </div>
  );
};

export default AdminPanel;

