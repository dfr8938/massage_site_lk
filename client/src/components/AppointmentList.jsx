import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const AppointmentList = ({ 
  appointments = [], 
  onReschedule, 
  onCancel, 
  services = [] 
}) => {
  const statusBodyTemplate = (rowData) => {
    let value, severity;
    
    switch(rowData.status) {
      case 'confirmed':
        value = 'Подтверждена';
        severity = 'success';
        break;
      case 'pending':
        value = 'Ожидание';
        severity = 'warning';
        break;
      case 'cancelled':
        value = 'Отменена';
        severity = 'danger';
        break;
      default:
        value = 'Неизвестно';
        severity = 'info';
    }
    
    return <Tag value={value} severity={severity} />;
  };

  const serviceBodyTemplate = (rowData) => {
    const service = services.find(s => s.id === rowData.serviceId);
    return service ? service.name : 'Неизвестно';
  };

  const actionBodyTemplate = (rowData) => {
    const isPast = new Date(rowData.date) < new Date();
    
    return (
      <div className="flex gap-2">
        {!isPast && rowData.status !== 'cancelled' && (
          <Button 
            label="Перенести" 
            icon="pi pi-refresh" 
            size="small" 
            onClick={() => onReschedule(rowData)} 
            className="p-button-outlined p-button-warning" 
            tooltip="Перенести запись на другое время"
            tooltipOptions={{ position: 'top' }}
          />
        )}
        
        {!isPast && rowData.status !== 'cancelled' && (
          <Button 
            label="Отменить" 
            icon="pi pi-times" 
            size="small" 
            onClick={() => onCancel(rowData)} 
            className="p-button-outlined p-button-danger" 
            tooltip="Отменить запись"
            tooltipOptions={{ position: 'top' }}
          />
        )}
      </div>
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
      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Пока нет записей</p>
        </div>
      ) : (
        <DataTable
          value={appointments}
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
            header="Статус" 
            body={statusBodyTemplate} 
            sortable 
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

export default AppointmentList;