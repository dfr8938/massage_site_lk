import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const MyData = ({ profile, onSave, onDeleteAccount }) => {
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleExportData = () => {
    // Создаем объект с данными для экспорта
    const data = {
      profile: editedProfile,
      exportDate: new Date().toISOString()
    };
    
    // Создаем и скачиваем файл
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDeleteAccount = () => {
    confirmDialog({
      message: 'Вы уверены, что хотите удалить свой аккаунт? Все ваши данные будут безвозвратно удалены.',
      header: 'Подтверждение удаления аккаунта',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onDeleteAccount(),
      reject: () => {}
    });
  };

  return (
    <div>
      <ConfirmDialog />
      
      {/* Профиль */}
      <Card 
        title="Мой профиль" 
        style={{ 
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd',
          marginBottom: '2rem'
        }}
      >
        {isEditing ? (
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="name" className="block font-medium mb-2">ФИО</label>
              <InputText 
                id="name" 
                value={editedProfile.name} 
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})} 
              />
            </div>
            
            <div className="field">
              <label htmlFor="email" className="block font-medium mb-2">Email</label>
              <InputText 
                id="email" 
                value={editedProfile.email} 
                onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})} 
              />
            </div>
            
            <div className="field">
              <label htmlFor="phone" className="block font-medium mb-2">Телефон</label>
              <InputText 
                id="phone" 
                value={editedProfile.phone} 
                onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})} 
              />
            </div>
            
            <div className="field">
              <label htmlFor="address" className="block font-medium mb-2">Адрес</label>
              <InputText 
                id="address" 
                value={editedProfile.address} 
                onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})} 
              />
            </div>
            
            <div className="flex gap-2" style={{ marginTop: '1.5rem' }}>
              <Button 
                label="Сохранить" 
                icon="pi pi-check" 
                onClick={handleSave} 
                className="p-button-outlined" 
                style={{ 
                  background: 'white', 
                  color: '#5a4a42', 
                  borderColor: '#d9d3ce' 
                }} 
              />
              <Button 
                label="Отмена" 
                icon="pi pi-times" 
                onClick={handleCancel} 
                text 
                style={{ color: '#5a4a42' }} 
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex align-items-center justify-content-between mb-3">
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#5a4a42' }}>
                  {editedProfile.name}
                </div>
                <div style={{ color: '#666', marginTop: '0.25rem' }}>
                  {editedProfile.email}
                </div>
              </div>
              <Button 
                label="Редактировать" 
                icon="pi pi-pencil" 
                onClick={handleEdit} 
                text 
                style={{ color: '#5a4a42' }} 
              />
            </div>
            
            <div className="grid" style={{ fontSize: '0.95rem' }}>
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-phone" style={{ color: '#5a4a42' }}></i>
                  <span>{editedProfile.phone}</span>
                </div>
              </div>
              
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-map-marker" style={{ color: '#5a4a42' }}></i>
                  <span>{editedProfile.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Настройки уведомлений */}
      <Card 
        title="Настройки уведомлений" 
        style={{ 
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd',
          marginBottom: '2rem'
        }}
      >
        <div className="field-checkbox">
          <Checkbox 
            inputId="email" 
            name="email" 
            value="email" 
            checked={notificationSettings.email} 
            onChange={(e) => setNotificationSettings({...notificationSettings, email: e.checked})} 
          />
          <label htmlFor="email" className="ml-2">Email-уведомления</label>
        </div>
        
        <div className="field-checkbox">
          <Checkbox 
            inputId="sms" 
            name="sms" 
            value="sms" 
            checked={notificationSettings.sms} 
            onChange={(e) => setNotificationSettings({...notificationSettings, sms: e.checked})} 
          />
          <label htmlFor="sms" className="ml-2">SMS-уведомления</label>
        </div>
        
        <div className="field-checkbox">
          <Checkbox 
            inputId="push" 
            name="push" 
            value="push" 
            checked={notificationSettings.push} 
            onChange={(e) => setNotificationSettings({...notificationSettings, push: e.checked})} 
          />
          <label htmlFor="push" className="ml-2">Push-уведомления</label>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <Button 
            label="Сохранить настройки" 
            icon="pi pi-save" 
            onClick={() => {}} 
            className="p-button-outlined" 
            style={{ 
              background: 'white', 
              color: '#5a4a42', 
              borderColor: '#d9d3ce' 
            }} 
          />
        </div>
      </Card>
      
      {/* Экспорт данных */}
      <Card 
        title="Экспорт моих данных" 
        style={{ 
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd',
          marginBottom: '2rem'
        }}
      >
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Вы можете экспортировать свои персональные данные в формате JSON. 
          Экспортированные данные включают ваш профиль, историю посещений и отзывы.
        </p>
        
        <Button 
          label="Экспортировать данные" 
          icon="pi pi-download" 
          onClick={handleExportData} 
          className="p-button-outlined" 
          style={{ 
            background: 'white', 
            color: '#5a4a42', 
            borderColor: '#d9d3ce' 
          }} 
        />
      </Card>
      
      {/* Удаление аккаунта */}
      <Card 
        title="Удаление аккаунта" 
        style={{ 
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd'
        }}
      >
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: '#666' }}>
          Удаление аккаунта приведет к безвозвратному удалению всех ваших данных, 
          включая профиль, историю посещений и отзывы. Эта операция необратима.
        </p>
        
        <Button 
          label="Удалить аккаунт" 
          icon="pi pi-trash" 
          onClick={confirmDeleteAccount} 
          className="p-button-danger" 
          outlined 
        />
      </Card>
    </div>
  );
};

export default MyData;