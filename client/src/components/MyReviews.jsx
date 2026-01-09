import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

// Глобальная переменная для предотвращения двойного вызова
let deleteConfirmationActive = false;

const MyReviews = ({ reviews = [], onAddReview, onEditReview, onDeleteReview }) => {
  const [newReview, setNewReview] = useState({
    text: '',
    rating: 5
  });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  const handleAddReview = () => {
    if (newReview.text.trim()) {
      onAddReview({
        id: Date.now(),
        text: newReview.text,
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0]
      });
      setNewReview({ text: '', rating: 5 });
    }
  };

  const startEdit = (review) => {
    setEditId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const saveEdit = () => {
    onEditReview(editId, {
      text: editText,
      rating: editRating
    });
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const confirmDelete = (review) => {
    // Проверяем, не активно ли уже подтверждение удаления
    if (deleteConfirmationActive) {
      return;
    }
    
    // Устанавливаем флаг активного подтверждения
    deleteConfirmationActive = true;
    
    confirmDialog({
      message: 'Вы уверены, что хотите удалить этот отзыв?',
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        onDeleteReview(review.id);
        // Сбрасываем флаг после удаления
        deleteConfirmationActive = false;
      },
      reject: () => {
        // Сбрасываем флаг при отмене
        deleteConfirmationActive = false;
      },
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      draggable: false,
      closeOnEscape: true,
      dismissable: true,
      // Дополнительная защита от повторного открытия
      onShow: () => {
        if (deleteConfirmationActive) {
          return false;
        }
        deleteConfirmationActive = true;
      },
      onHide: () => {
        deleteConfirmationActive = false;
      }
    });
  };

  return (
    <div>
      <ConfirmDialog />
      
      {/* Существующие отзывы */}
      <div className="grid">
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Пока нет отзывов</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="col-12" key={review.id}>
              <Card 
                style={{ 
                  background: '#f9f6f3',
                  borderRadius: '12px',
                  border: '1px solid #eae4dd'
                }}
              >
                <div className="flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    {review.date}
                  </span>
                  {editId === review.id ? (
                    <div className="flex gap-2">
                      <Button 
                        icon="pi pi-check" 
                        rounded 
                        text 
                        onClick={saveEdit} 
                        size="small" 
                      />
                      <Button 
                        icon="pi pi-times" 
                        rounded 
                        text 
                        onClick={cancelEdit} 
                        size="small" 
                        severity="danger" 
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        icon="pi pi-pencil" 
                        rounded 
                        text 
                        onClick={() => startEdit(review)} 
                        size="small" 
                        severity="warning" 
                      />
                      <Button 
                        icon="pi pi-trash" 
                        rounded 
                        text 
                        onClick={() => confirmDelete(review)} 
                        size="small" 
                        severity="danger" 
                      />
                    </div>
                  )}
                </div>
                
                {editId === review.id ? (
                  <div className="field">
                    <InputTextarea 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)} 
                      rows={3} 
                      style={{ width: '100%', marginBottom: '1rem' }} 
                    />
                    <div className="flex align-items-center gap-2">
                      <Rating 
                        value={editRating} 
                        onChange={(e) => setEditRating(e.value)} 
                        cancel={false} 
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      cancel={false} 
                      className="mb-2" 
                    />
                    <p style={{ margin: '0.5rem 0', lineHeight: '1.6' }}>
                      {review.text}
                    </p>
                  </>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
      
      {/* Форма добавления отзыва */}
      <Card 
        title="Оставить отзыв" 
        style={{ 
          marginTop: '2rem',
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd'
        }}
        className="mb-4"
      >
        <div className="field">
          <label htmlFor="reviewText" className="block font-medium mb-2">
            Ваш отзыв
          </label>
          <InputTextarea 
            id="reviewText" 
            value={newReview.text} 
            onChange={(e) => setNewReview({...newReview, text: e.target.value})} 
            rows={4} 
            placeholder="Поделитесь своим опытом..." 
            style={{ width: '100%' }} 
          />
        </div>
        
        <div className="field">
          <label htmlFor="reviewRating" className="block font-medium mb-2">
            Оценка
          </label>
          <Rating 
            id="reviewRating" 
            value={newReview.rating} 
            onChange={(e) => setNewReview({...newReview, rating: e.value})} 
            cancel={false} 
          />
        </div>
        
        <Button 
          label="Опубликовать" 
          icon="pi pi-send" 
          onClick={handleAddReview} 
          className="p-button-outlined" 
          style={{ 
            background: 'white', 
            color: '#5a4a42', 
            borderColor: '#d9d3ce',
            marginTop: '1rem' 
          }} 
        />
      </Card>
    </div>
  );
};

export default MyReviews;