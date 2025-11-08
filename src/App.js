import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import BreadList from './components/BreadList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import BreadStatistics from './components/BreadStatistics'; // ✅ Добавлен импорт
import './styles/App.css';

function App() {
  // 👇 состояние авторизации
  const [user, setUser] = useState(null);
  // 👇 данные заказов и вкладки
  const [orderItems, setOrderItems] = useState([]);
  const [activeTab, setActiveTab] = useState('breads');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/current', {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  // ✅ выход из аккаунта
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        setOrderItems([]);
        toast.success('Вы успешно вышли из системы');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Ошибка при выходе', error);
      toast.error('Ошибка при выходе из системы');
    }
  };

  // ✅ добавление хлеба в заказ
  const handleAddToOrder = (breadId, quantity) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.id === breadId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === breadId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Временное решение - позже заменим реальными данными из API
        return [
          ...prev,
          {
            id: breadId,
            quantity,
            name: `Хлеб ${breadId}`,
            price: 50
          },
        ];
      }
    });
    toast.success(`Добавлено ${quantity} хлеба в заказ`);
  };

  // ✅ очистка корзины
  const handleClearCart = () => {
    setOrderItems([]);
    toast.info('Корзина очищена');
  };

  // ✅ создание заказа
  const handleOrderCreated = (orderData) => {
    console.log('Order created:', orderData);
    toast.success('Заказ успешно создан!');
  };

  // Показываем загрузку при проверке авторизации
  if (checkingAuth) {
    return (
      <div className="loading">
        Проверка авторизации...
      </div>
    );
  }

  // Если пользователь не вошёл → показываем страницу входа
  if (!user || !user.authenticated) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  // После входа показываем интерфейс
  return (
    <div className="App">
      <Header username={user.username} onLogout={handleLogout} />

      <nav className="main-nav">
        <button
          className={activeTab === 'breads' ? 'active' : ''}
          onClick={() => setActiveTab('breads')}
        >
          Каталог хлеба
        </button>
        <button
          className={activeTab === 'order' ? 'active' : ''}
          onClick={() => setActiveTab('order')}
        >
          Оформление заказа ({orderItems.length})
        </button>
        <button
          className={activeTab === 'statistics' ? 'active' : ''} // ✅ Новая вкладка
          onClick={() => setActiveTab('statistics')}
        >
          📊 Статистика
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          История заказов
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'breads' && (
          <BreadList onAddToOrder={handleAddToOrder} />
        )}

        {activeTab === 'order' && (
          <OrderForm
            orderItems={orderItems}
            onOrderCreated={handleOrderCreated}
            onClearCart={handleClearCart}
          />
        )}

        {activeTab === 'statistics' && ( // ✅ Новая вкладка
          <BreadStatistics />
        )}

        {activeTab === 'history' && <OrderList />}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;