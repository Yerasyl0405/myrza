import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
    withCredentials: true, // Это важно для отправки кук

});

export const breadAPI = {
  // Получить все виды хлеба
  getAllBreads: () => api.get('/breads'),

  // Получить хлеб по ID
  getBreadById: (id) => api.get(`/breads/${id}`),
};

export const orderAPI = {
  // Создать заказ
  createOrder: (orderData) => api.post('/orders', orderData),

  // Получить все заказы
  getAllOrders: () => api.get('/orders'),

  // Получить заказ по ID
  getOrderById: (id) => api.get(`/orders/${id}`),

  // Обновить статус заказа
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, status),
};

export default api;