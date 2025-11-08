import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './BreadStatistics.css';

const BreadStatistics = () => {
  const [breadStats, setBreadStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchBreadStatistics();
  }, [timeRange]);

  const fetchBreadStatistics = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      const orders = response.data;

      // Собираем статистику по хлебам
      const stats = calculateBreadStatistics(orders);
      setBreadStats(stats);
    } catch (error) {
      console.error('Error fetching bread statistics:', error);
      setError('Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  const calculateBreadStatistics = (orders) => {
    const breadMap = new Map();

    orders.forEach(order => {
      // Фильтруем заказы по времени если нужно
      if (shouldIncludeOrder(order, timeRange)) {
        order.items.forEach(item => {
          const breadName = item.breadName;
          const quantity = item.quantity;
          const revenue = item.subtotal;

          if (breadMap.has(breadName)) {
            const existing = breadMap.get(breadName);
            breadMap.set(breadName, {
              ...existing,
              totalQuantity: existing.totalQuantity + quantity,
              totalRevenue: existing.totalRevenue + revenue,
              orderCount: existing.orderCount + 1
            });
          } else {
            breadMap.set(breadName, {
              breadName,
              totalQuantity: quantity,
              totalRevenue: revenue,
              orderCount: 1,
              averagePrice: item.price
            });
          }
        });
      }
    });

    // Сортируем по количеству (по убыванию)
    return Array.from(breadMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  };

  const shouldIncludeOrder = (order, range) => {
    if (range === 'all') return true;

    const orderDate = new Date(order.orderDate);
    const now = new Date();

    switch (range) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return orderDate >= monthAgo;
      default:
        return true;
    }
  };

  const getTotalStats = () => {
    const totalQuantity = breadStats.reduce((sum, bread) => sum + bread.totalQuantity, 0);
    const totalRevenue = breadStats.reduce((sum, bread) => sum + bread.totalRevenue, 0);
    const totalOrders = breadStats.reduce((sum, bread) => sum + bread.orderCount, 0);

    return { totalQuantity, totalRevenue, totalOrders };
  };

  if (loading) return <div className="loading">Загрузка статистики...</div>;
  if (error) return <div className="error">{error}</div>;

  const totals = getTotalStats();

  return (
    <div className="bread-statistics">
      <div className="stats-header">
        <h2>📊 Статистика по хлебам</h2>
        <div className="time-filter">
          <label>Период:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">За все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>
        </div>
      </div>

      {/* Сводная статистика */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Всего продано</h3>
          <div className="summary-value">{totals.totalQuantity} шт.</div>
        </div>
        <div className="summary-card">
          <h3>Общая выручка</h3>
          <div className="summary-value">{totals.totalRevenue.toFixed(2)} ₽</div>
        </div>
        <div className="summary-card">
          <h3>Заказов</h3>
          <div className="summary-value">{totals.totalOrders}</div>
        </div>
        <div className="summary-card">
          <h3>Видов хлеба</h3>
          <div className="summary-value">{breadStats.length}</div>
        </div>
      </div>

      {/* Детальная таблица */}
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Хлеб</th>
              <th>Количество</th>
              <th>Выручка</th>
              <th>Заказов</th>
              <th>Средняя цена</th>
              <th>Доля от общей выручки</th>
            </tr>
          </thead>
          <tbody>
            {breadStats.map((bread, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td className="bread-name">
                  <span className="bread-emoji">🍞</span>
                  {bread.breadName}
                </td>
                <td className="quantity-cell">
                  <div className="quantity-bar">
                    <div
                      className="quantity-fill"
                      style={{
                        width: `${(bread.totalQuantity / totals.totalQuantity) * 100}%`
                      }}
                    ></div>
                    <span className="quantity-text">{bread.totalQuantity} шт.</span>
                  </div>
                </td>
                <td className="revenue-cell">{bread.totalRevenue.toFixed(2)} ₽</td>
                <td className="orders-cell">{bread.orderCount}</td>
                <td className="price-cell">{bread.averagePrice.toFixed(2)} ₽</td>
                <td className="percentage-cell">
                  {((bread.totalRevenue / totals.totalRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {breadStats.length === 0 && (
        <div className="no-data">
          Нет данных о продажах за выбранный период
        </div>
      )}
    </div>
  );
};

export default BreadStatistics;