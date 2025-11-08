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
      const baseUrl = process.env.REACT_APP_API_URL || 'https://back-myrza.onrender.com';

      // URLSearchParams автоматически кодирует данные и убирает лишние кавычки
      const params = new URLSearchParams();
      params.append('username', username.trim());
      params.append('password', password.trim());

      console.log('🔹 Отправка запроса на логин...', { username, password });

      const loginResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        credentials: 'include',
      });

      console.log('📡 Статус ответа:', loginResponse.status);

      if (loginResponse.ok) {
        console.log('✅ Успешный логин, получаем данные пользователя...');

        const userResponse = await fetch(`${baseUrl}/api/user/current`, {
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('👤 Пользователь:', userData);

          onLoginSuccess(userData);
          toast.success('Успешный вход!');
        } else {
          const errorText = await userResponse.text();
          throw new Error(`Ошибка получения пользователя: ${errorText}`);
        }
      } else {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Неверные данные');
      }
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
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
