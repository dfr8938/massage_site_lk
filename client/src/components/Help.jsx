import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Часто задаваемые вопросы
  const faqItems = [
    {
      question: 'Как подготовиться к сеансу массажа?',
      answer: 'Рекомендуется прийти за 10-15 минут до начала, избегать тяжелой пищи за 1-2 часа до сеанса. Одежда должна быть удобной и легко сниматься.'
    },
    {
      question: 'Какие есть противопоказания для массажа?',
      answer: 'Острые воспалительные процессы, высокая температура, онкологические заболевания, острые травмы. Перед сеансом обязательно сообщите о всех своих заболеваниях.'
    },
    {
      question: 'Как часто можно проходить сеансы?',
      answer: 'Рекомендуемый интервал зависит от цели: для расслабления - 1-2 раза в неделю, для лечения - по рекомендации специалиста.'
    },
    {
      question: 'Можно ли делать массаж при беременности?',
      answer: 'Специальный массаж для беременных доступен со 2-го триместра при отсутствии противопоказаний. Обязательна консультация с врачом.'
    },
    {
      question: 'Как отменить или перенести запись?',
      answer: 'Вы можете отменить или перенести запись в разделе "Мои записи" в личном кабинете. Уведомление за 12 часов обязательно.'
    }
  ];
  
  // Рекомендации по уходу
  const recommendations = [
    {
      category: 'После классического массажа',
      advice: 'Рекомендуется отдых 30-60 минут, обильное питье, избегать физических нагрузок в течение 24 часов. Возможна легкая мышечная слабость.'
    },
    {
      category: 'После спортивного массажа',
      advice: 'Важно растянуть мышцы после сеанса, пить достаточно воды. Эффект проявляется через 2-3 дня.'
    },
    {
      category: 'После лечебного массажа',
      advice: 'Следует соблюдать рекомендации специалиста, выполнять домашние упражнения. Курс обычно составляет 5-10 сеансов.'
    },
    {
      category: 'Для поддержания результата',
      advice: 'Регулярные сеансы 1-2 раза в месяц, правильная осанка, физическая активность, здоровое питание и достаточный сон.'
    }
  ];
  
  // Фильтрация вопросов по поисковому запросу
  const filteredFaq = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      {/* Поиск */}
      <div className="p-input-icon-left" style={{ marginBottom: '2rem' }}>
        <i className="pi pi-search"></i>
        <InputText 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Поиск по вопросам и рекомендациям..." 
          style={{ width: '100%' }} 
        />
      </div>
      
      {/* Часто задаваемые вопросы */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          color: '#5a4a42', 
          fontWeight: '500', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="pi pi-question-circle"></i>
          Часто задаваемые вопросы
          <Badge value={filteredFaq.length} severity="info" />
        </h3>
        
        {filteredFaq.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '2rem',
              background: '#f9f6f3',
              borderRadius: '12px',
              border: '1px solid #eae4dd'
            }}
          >
            <p>По вашему запросу ничего не найдено</p>
          </div>
        ) : (
          <Accordion>
            {filteredFaq.map((item, index) => (
              <AccordionTab 
                key={index} 
                header={item.question}
                pt={{
                  header: {
                    style: {
                      background: '#f9f6f3',
                      border: '1px solid #eae4dd',
                      borderRadius: '8px',
                      margin: '0.5rem 0'
                    }
                  },
                  toggleIcon: {
                    style: { color: '#5a4a42' }
                  }
                }}
              >
                <p style={{ lineHeight: '1.6', color: '#555' }}>{item.answer}</p>
              </AccordionTab>
            ))}
          </Accordion>
        )}
      </div>
      
      {/* Рекомендации по уходу */}
      <div>
        <h3 style={{ 
          color: '#5a4a42', 
          fontWeight: '500', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="pi pi-heart"></i>
          Рекомендации по уходу
          <Badge value={recommendations.length} severity="success" />
        </h3>
        
        <Accordion>
          {recommendations.map((item, index) => (
            <AccordionTab 
              key={index} 
              header={item.category}
              pt={{
                header: {
                  style: {
                    background: '#f9f6f3',
                    border: '1px solid #eae4dd',
                    borderRadius: '8px',
                    margin: '0.5rem 0'
                  }
                },
                toggleIcon: {
                  style: { color: '#5a4a42' }
                }
              }}
            >
              <p style={{ lineHeight: '1.6', color: '#555' }}>{item.advice}</p>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
      
      {/* Контактная форма */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Не нашли ответ на свой вопрос?
        </p>
        <Button 
          label="Связаться с нами" 
          icon="pi pi-send" 
          onClick={() => window.location.href = '/contact'} 
          className="p-button-outlined" 
          style={{ 
            background: 'white', 
            color: '#5a4a42', 
            borderColor: '#d9d3ce' 
          }} 
        />
      </div>
    </div>
  );
};

export default Help;