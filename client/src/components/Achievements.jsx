import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';

const Achievements = ({ appointments = [] }) => {
  // Рассчитываем статистику
  const totalVisits = appointments.filter(app => new Date(app.date) < new Date()).length;
  const upcomingVisits = appointments.filter(app => new Date(app.date) >= new Date()).length;
  
  // Прогресс до следующей награды
  const visitsForNextReward = 5;
  const progress = (totalVisits % visitsForNextReward) / visitsForNextReward * 100;
  
  // Определяем уровень
  const getLevel = (visits) => {
    if (visits >= 50) return { level: 'Мастер', color: '#D4AF37', icon: 'pi pi-star-fill' };
    if (visits >= 25) return { level: 'Эксперт', color: '#C0C0C0', icon: 'pi pi-star-fill' };
    if (visits >= 10) return { level: 'Профи', color: '#CD7F32', icon: 'pi pi-star-fill' };
    if (visits >= 5) return { level: 'Опытный', color: '#8B4513', icon: 'pi pi-star-fill' };
    return { level: 'Новичок', color: '#696969', icon: 'pi pi-star' };
  };
  
  const levelInfo = getLevel(totalVisits);
  
  // Определяем доступные награды
  const rewards = [
    { threshold: 5, name: 'Первый сеанс', description: 'За первую запись', achieved: totalVisits >= 5 },
    { threshold: 10, name: 'Регулярный клиент', description: 'За 10 посещений', achieved: totalVisits >= 10 },
    { threshold: 25, name: 'Преданный', description: 'За 25 посещений', achieved: totalVisits >= 25 },
    { threshold: 50, name: 'Мастер восстановления', description: 'За 50 посещений', achieved: totalVisits >= 50 }
  ];
  
  // Доступные бонусы
  const bonuses = [
    { id: 1, name: 'Скидка 5%', description: 'На следующий сеанс', validUntil: '2025-12-31', active: true },
    { id: 2, name: 'Бесплатный чай', description: 'При посещении', validUntil: '2025-11-30', active: true },
    { id: 3, name: 'Удлинение сеанса', description: '+15 минут к следующему сеансу', validUntil: '2025-10-15', active: false }
  ];

  return (
    <div>
      {/* Общая статистика */}
      <div className="grid">
        <div className="col-12 md:col-6">
          <Card 
            title="Ваш уровень" 
            style={{ 
              background: '#f9f6f3',
              borderRadius: '12px',
              border: '1px solid #eae4dd',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', color: levelInfo.color, marginBottom: '0.5rem' }}>
              <i className={levelInfo.icon}></i>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '500', color: '#5a4a42', marginBottom: '0.5rem' }}>
              {levelInfo.level}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {totalVisits} посещений
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6">
          <Card 
            title="Следующая награда" 
            style={{ 
              background: '#f9f6f3',
              borderRadius: '12px',
              border: '1px solid #eae4dd'
            }}
          >
            <div className="flex align-items-center justify-content-between mb-3">
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {totalVisits % 5 + 1} из 5 посещений
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                Награда: скидка 5%
              </span>
            </div>
            <ProgressBar 
              value={progress} 
              style={{ height: '8px', borderRadius: '4px' }} 
              pt={{
                value: { style: { background: '#d4a76a' } }
              }}
            />
          </Card>
        </div>
      </div>
      
      {/* Награды */}
      <Card 
        title="Ваши награды" 
        style={{ 
          marginTop: '2rem',
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd'
        }}
      >
        <div className="grid">
          {rewards.map((reward, index) => (
            <div className="col-12 md:col-6 lg:col-3" key={index}>
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '1.5rem', 
                  background: reward.achieved ? '#f0f7f4' : '#fdf5f5',
                  border: reward.achieved ? '1px solid #b8e0c0' : '1px solid #f5c6c6',
                  borderRadius: '12px',
                  opacity: reward.achieved ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  <i 
                    className={reward.achieved ? 'pi pi-trophy' : 'pi pi-trophy'} 
                    style={{ 
                      color: reward.achieved ? '#1a6b3a' : '#992a2a' 
                    }} 
                  ></i>
                </div>
                <div style={{ fontWeight: '500', color: '#5a4a42', marginBottom: '0.25rem' }}>
                  {reward.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  {reward.description}
                </div>
                {reward.achieved && (
                  <Badge 
                    value="Получено" 
                    severity="success" 
                    style={{ 
                      marginTop: '0.5rem', 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem' 
                    }} 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Бонусы */}
      <Card 
        title="Доступные бонусы" 
        style={{ 
          marginTop: '2rem',
          background: '#f9f6f3',
          borderRadius: '12px',
          border: '1px solid #eae4dd'
        }}
      >
        <div className="grid">
          {bonuses.map((bonus, index) => (
            <div className="col-12 md:col-6" key={index}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem', 
                  background: bonus.active ? '#f0f7f4' : '#fdf5f5',
                  border: bonus.active ? '1px solid #b8e0c0' : '1px solid #f5c6c6',
                  borderRadius: '12px',
                  opacity: bonus.active ? 1 : 0.6
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: '#5a4a42' }}>{bonus.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{bonus.description}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    Действует до {new Date(bonus.validUntil).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                {bonus.active && (
                  <Badge 
                    value="Активен" 
                    severity="success" 
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem' 
                    }} 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Achievements;