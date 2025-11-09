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

      // Создаем FormData для отправки
      const formData = new URLSearchParams();
      formData.append('username', username.trim());
      formData.append('password', password.trim());

      console.log('🔹 Отправка запроса на логин...', {
        username: username.trim(),
        password: password.trim(),
        url: `${baseUrl}/login`
      });

      const loginResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include', // важно для сессий и куков
      });

      console.log('📡 Статус ответа:', loginResponse.status);
      console.log('📡 Заголовки ответа:', loginResponse.headers);

      if (loginResponse.ok) {
        const responseData = await loginResponse.text();
        console.log('✅ Успешный логин:', responseData);

        // Даем время на установку сессии
        await new Promise(resolve => setTimeout(resolve, 100));

        // Получаем данные пользователя
        const userResponse = await fetch(`${baseUrl}/api/user/current`, {
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('👤 Данные пользователя:', userData);

          onLoginSuccess(userData);
          toast.success('Успешный вход!');
        } else {
          const errorText = await userResponse.text();
          console.error('❌ Ошибка получения пользователя:', errorText);
          throw new Error(`Ошибка получения данных пользователя: ${userResponse.status}`);
        }
      } else {
        let errorMessage = 'Неверные учетные данные';
        try {
          const errorData = await loginResponse.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await loginResponse.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
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
              placeholder="Введите логин"
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
              placeholder="Введите пароль"
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
          <p><strong>👥 Guest:</strong> guest1 / guest1</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;