import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import styles from '../pages/ClientCabinet.module.css';

const AppointmentList = ({ appointments, onReschedule, onCancel, services }) => {
  const toast = React.useRef(null);

  const statusBodyTemplate = (rowData) => (
    <span
      className="inline-flex align-items-center justify-content-center"
      style={{
        width: '100px',
        height: '32px',
        background: rowData.status === 'confirmed'
          ? 'linear-gradient(90deg, #f0f7f4, #e6f4e8)'
          : 'linear-gradient(90deg, #fdf5f5, #fdecec)',
        color: rowData.status === 'confirmed' ? '#1a6b3a' : '#992a2a',
        border: '1px solid',
        borderColor: rowData.status === 'confirmed' ? '#b8e0c0' : '#f5c6c6',
        borderRadius: '16px',
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'none'
      }}
    >
      {rowData.status === 'confirmed' ? 'Подтверждено' : 'Ожидание'}
    </span>
  );

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-content-center">
      <Button 
        icon="pi pi-refresh"
        rounded 
        text
        raised
        tooltip="Перенести" 
        tooltipOptions={{ position: 'top' }}
        onClick={() => onReschedule(rowData)}
        style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(90deg, #e6f4e8, #f0f7f4)',
          border: '1px solid #b8e0c0',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
      <Button 
        icon="pi pi-trash"
        rounded 
        text
        raised
        tooltip="Отменить" 
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          confirmDialog({
            message: 'Вы уверены, что хотите отменить эту запись?',
            header: 'Подтверждение отмены',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              onCancel(rowData);
              toast.current.show({
                severity: 'info', 
                summary: 'Отменено', 
                detail: 'Запись отменена'
              });
            }
          });
        }}
        style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(90deg, #fdf5f5, #fdecec)',
          border: '1px solid #f5c6c6',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
    </div>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU');
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="card p-4" style={{ background: '#f9f6f3', borderRadius: '12px' }}>
        <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
          <i className="pi pi-list mr-2"></i>Мои записи
        </h4>
        
        <DataTable
          value={appointments}
          paginator
          rows={10}
          sortMode="single"
          sortField="date"
          sortOrder={-1}
          emptyMessage="У вас пока нет записей"
          style={{ marginBottom: '1rem' }}
        >
          <Column
            field="date"
            header="Дата"
            sortable
            body={(rowData) => formatDate(rowData.date)}
          />
          <Column
            field="service"
            header="Услуга"
            sortable
          />
          <Column
            header="Цена (₽)"
            body={(rowData) => {
              const service = services?.find(s => s.id === rowData.serviceId) || { price: 0 };
              return <span style={{ fontWeight: 500 }}>{service?.price.toLocaleString() || '—'}</span>;
            }}
            sortable
            style={{ textAlign: 'right' }}
          />
          <Column 
            body={statusBodyTemplate} 
            header="Статус" 
          />
          <Column 
            body={actionBodyTemplate} 
            header="Действия" 
            align="center" 
          />
        </DataTable>
      </div>
    </>
  );
};

export default React.memo(AppointmentList);