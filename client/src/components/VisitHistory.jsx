import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const VisitHistory = ({ appointments = [], services = [], onReschedule }) => {
  // Фильтруем только прошедшие сеансы
  const pastAppointments = appointments
    .filter(appointment => new Date(appointment.date) < new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const serviceBodyTemplate = (rowData) => {
    const service = services.find(s => s.id === rowData.serviceId);
    return service ? service.name : 'Неизвестно';
  };

  const durationBodyTemplate = (rowData) => {
    const service = services.find(s => s.id === rowData.serviceId);
    return service ? `${service.duration} мин` : '';
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        label="Повторить"
        icon="pi pi-refresh"
        size="small"
        onClick={() => onReschedule(rowData)}
        className="p-button-outlined"
      />
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {pastAppointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Пока нет посещений</p>
        </div>
      ) : (
        <DataTable
          value={pastAppointments}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem' }}
          style={{ background: '#f9f6f3', borderRadius: '12px' }}
          pt={{
            root: {
              style: { border: '1px solid #eae4dd', borderRadius: '12px' }
            }
          }}
        >
          <Column 
            field="date" 
            header="Дата и время" 
            body={dateBodyTemplate} 
            sortable 
          />
          <Column 
            header="Услуга" 
            body={serviceBodyTemplate} 
            sortable 
          />
          <Column 
            header="Длительность" 
            body={durationBodyTemplate} 
            sortable 
          />
          <Column 
            header="Статус" 
            body={() => <Tag value="Завершено" severity="success" />} 
          />
          <Column 
            header="Действия" 
            body={actionBodyTemplate} 
            align="center" 
          />
        </DataTable>
      )}
    </div>
  );
};

export default VisitHistory;