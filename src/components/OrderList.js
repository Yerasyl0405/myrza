import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return '#2196f3';
      case 'IN_PROGRESS': return '#ff9800';
      case 'COMPLETED': return '#4caf50';
      case 'CANCELLED': return '#f44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (loading) return <div className="loading">Загрузка заказов...</div>;

  return (
    <div className="order-list">
      <h2>История заказов</h2>

      {orders.length === 0 ? (
        <p className="no-orders">Заказов пока нет</p>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <h3>Заказ #{order.orderId}</h3>
                <span
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-info">
                <p><strong>Клиент:</strong> {order.customerName}</p>
                <p><strong>Дата:</strong> {formatDate(order.orderDate)}</p>
                <p><strong>Сумма:</strong> {order.totalAmount} ₽</p>
              </div>

              <div className="order-items">
                <h4>Состав заказа:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.breadName}</span>
                    <span>{item.quantity} × {item.price} ₽ = {item.subtotal} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;