import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from '../pages/ClientCabinet.module.css';

const ProfileCard = ({ profile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="card p-4" style={{ background: '#f9f6f3', borderRadius: '12px' }}>
      <h4 style={{ color: '#5a4a42', marginBottom: '1.2rem' }}>
        <i className="pi pi-user mr-2"></i>Мой профиль
      </h4>
      
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="name" style={{ color: '#5a4a42', fontWeight: 500 }}>Имя</label>
          {isEditing ? (
            <InputText 
              id="name" 
              value={editedProfile.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          ) : (
            <div style={{ padding: '0.5rem 0', color: '#555' }}>{editedProfile.name}</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="email" style={{ color: '#5a4a42', fontWeight: 500 }}>Email</label>
          {isEditing ? (
            <InputText 
              id="email" 
              type="email" 
              value={editedProfile.email} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          ) : (
            <div style={{ padding: '0.5rem 0', color: '#555' }}>{editedProfile.email}</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="phone" style={{ color: '#5a4a42', fontWeight: 500 }}>Телефон</label>
          {isEditing ? (
            <InputText 
              id="phone" 
              value={editedProfile.phone} 
              onChange={(e) => handleChange('phone', e.target.value)} 
            />
          ) : (
            <div style={{ padding: '0.5rem 0', color: '#555' }}>{editedProfile.phone}</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="address" style={{ color: '#5a4a42', fontWeight: 500 }}>Адрес</label>
          {isEditing ? (
            <InputText 
              id="address" 
              value={editedProfile.address} 
              onChange={(e) => handleChange('address', e.target.value)} 
            />
          ) : (
            <div style={{ padding: '0.5rem 0', color: '#555' }}>{editedProfile.address}</div>
          )}
        </div>
      </div>

      <div className="flex gap-2" style={{ marginTop: '1.5rem' }}>
        {isEditing ? (
          <>
            <Button 
              label="Сохранить" 
              icon="pi pi-check" 
              onClick={handleSave} 
              className={styles['gradient-button']} 
            />
            <Button 
              label="Отмена" 
              icon="pi pi-times" 
              onClick={handleCancel} 
              className="p-button-outlined" 
              style={{ color: '#5a4a42' }}
            />
          </>
        ) : (
          <Button 
            label="Редактировать" 
            icon="pi pi-pencil" 
            onClick={handleEdit} 
            className={styles['gradient-button']} 
          />
        )}
      </div>
    </div>
  );
};

export default ProfileCard;