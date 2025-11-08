import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ИСПРАВЛЕННАЯ СТРОКА - правильное формирование URL
      const baseUrl = process.env.REACT_APP_API_URL || 'https://back-myrza.onrender.com';
      const formData = new FormData();
      formData.append('username', "erasil");
      formData.append('password', "erasil");

      console.log('Отправка запроса на логин...');

      // 1. Отправляем запрос на аутентификацию
      const loginResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Статус ответа:', loginResponse.status);

      if (loginResponse.ok) {
        const result = await loginResponse.json();
        console.log('Успешный логин:', result);

        // 2. После успешного логина получаем данные пользователя
        const userResponse = await fetch(`${baseUrl}/api/user/current`, {
          credentials: 'include'
        });

        console.log('Статус получения пользователя:', userResponse.status);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('Данные пользователя:', userData);

          // 3. Сохраняем пользователя в состоянии
          onLoginSuccess(userData);
          toast.success('Успешный вход!');
        } else {
          const errorText = await userResponse.text();
          console.error('Ошибка получения пользователя:', errorText);
          throw new Error('Не удалось получить данные пользователя');
        }
      } else {
        // Пробуем получить JSON ошибки
        try {
          const errorData = await loginResponse.json();
          throw new Error(errorData.error || errorData.message || 'Неверные учетные данные');
        } catch (jsonError) {
          // Если не JSON, то читаем как текст
          const errorText = await loginResponse.text();
          throw new Error(errorText || `Ошибка сервера: ${loginResponse.status}`);
        }
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast.error(error.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Вход в систему пекарни</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="admin или user"
            />
          </div>

          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="admin или user"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Тестовые аккаунты:</h4>
          <p><strong>👑 Admin:</strong> admin / admin</p>
          <p><strong>👤 User:</strong> user / user</p>
          <p><em>Проверьте консоль браузера для отладки</em></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;