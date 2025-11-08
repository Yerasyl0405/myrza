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
      // ✅ ВАЖНО: Используем FormData для Spring Security
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      console.log('Отправка запроса на логин...');

      // 1. Отправляем запрос на аутентификацию
      const loginResponse = await fetch('http://localhost:8080/login', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Статус ответа:', loginResponse.status);

      // ✅ ФИКС: Сначала проверяем статус, потом читаем тело ОДИН раз
      if (loginResponse.ok) {
        // Успешный логин
        console.log('Успешный логин');

        // 2. После успешного логина получаем данные пользователя
        const userResponse = await fetch('http://localhost:8080/api/user/current', {
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
          console.error('Ошибка получения пользователя:', userResponse.status);
          throw new Error('Не удалось получить данные пользователя');
        }
      } else {
        // Ошибка логина - читаем тело ответа ОДИН раз
        const errorText = await loginResponse.text();
        console.error('Ошибка логина:', errorText);

        // Пробуем распарсить JSON ошибки
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.message || 'Неверные учетные данные');
        } catch {
          // Если не JSON, используем текст как есть
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