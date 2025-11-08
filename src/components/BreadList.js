import React, { useState, useEffect } from 'react';
import BreadCard from './BreadCard';
import { breadAPI } from '../services/api';
import './BreadList.css';

const BreadList = ({ onAddToOrder }) => {
  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreads = async () => {
      try {
        console.log('🔄 Загрузка хлебов...');
        const response = await breadAPI.getAllBreads();
        console.log('✅ Хлебы загружены:', response.data);
        setBreads(response.data);
      } catch (err) {
        console.error('❌ Ошибка загрузки хлебов:', err);

        if (err.response) {
          // Сервер ответил с ошибкой
          if (err.response.status === 401) {
            setError('Ошибка авторизации. Пожалуйста, войдите снова.');
          } else if (err.response.status === 403) {
            setError('Доступ запрещен.');
          } else {
            setError(`Ошибка сервера: ${err.response.status}`);
          }
        } else if (err.request) {
          // Запрос был сделан, но ответ не получен
          setError('Не удалось подключиться к серверу. Проверьте подключение.');
        } else {
          // Что-то пошло не так
          setError('Неизвестная ошибка при загрузке хлеба');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBreads();
  }, []);

  if (loading) {
    return (
      <div className="bread-list">
        <h2>Наши виды хлеба</h2>
        <div className="loading">Загрузка хлеба...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bread-list">
        <h2>Наши виды хлеба</h2>
        <div className="error">
          {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bread-list">
      <h2>Наши виды хлеба ({breads.length})</h2>
      <div className="breads-grid">
        {breads.map(bread => (
          <BreadCard
            key={bread.id}
            bread={bread}
            onAddToOrder={onAddToOrder}
          />
        ))}
      </div>
    </div>
  );
};

export default BreadList;