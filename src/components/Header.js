import React from 'react';
import './Header.css';

const Header = ({ username, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="header-title">🍞 Пекарня "Вкусный Хлеб"</h1>
        <p className="header-subtitle">Свежий хлеб каждый день</p>

        {/* Блок пользователя и кнопка выхода */}
        <div className="user-info">
          <span className="welcome-text">Добро пожаловать, {username}!</span>
          <button
            onClick={onLogout}
            className="logout-btn"
            title="Выйти из системы"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;