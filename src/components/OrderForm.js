import React, { useState } from 'react';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './OrderForm.css';

const OrderForm = ({ orderItems, onOrderCreated, onClearCart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Добавьте хотя бы один хлеб в заказ');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
        items: orderItems.map(item => ({
          breadId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await orderAPI.createOrder(orderData);

      toast.success('Заказ успешно создан!');
      onOrderCreated(response.data);
      onClearCart();
      setCustomerInfo({ name: '', phone: '', address: '' });
    } catch (error) {
      toast.error('Ошибка при создании заказа');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form">
      <h2>Оформление заказа</h2>

      {orderItems.length > 0 ? (
        <>
          <div className="order-summary">
            <h3>Ваш заказ:</h3>
            {orderItems.map((item, index) => (
              <div key={index} className="order-item-summary">
                <span>{item.name}</span>
                <span>{item.quantity} × {item.price} ₽ = {item.quantity * item.price} ₽</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Итого: {calculateTotal()} ₽</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-group">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес доставки:</label>
              <textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                required
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </form>
        </>
      ) : (
        <p className="empty-cart">Корзина пуста. Добавьте хлеб из каталога.</p>
      )}
    </div>
  );
};

export default OrderForm;