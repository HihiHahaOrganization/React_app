import React, { useState } from 'react';
import Cookies from 'js-cookie';

export default function Header({ setUserSessionId }) {
  const [showLogin, setShowLogin] = useState(false);
  const [login, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/login/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.userSessionId) {
        setUserSessionId(data.userSessionId);
        Cookies.set('userSessionId', data.userSessionId); // сохраняем в куки
        setUsername('');  // очистка логина
        setPassword('');  // очистка пароля
        setShowLogin(false); // Закрываем окно
      } else {
        alert('Неверный логин или пароль'); //ошибка только при неуспехе
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при попытке авторизации');
    }
  };
  

  return (
    <header className="flex justify-between items-center bg-orange-400 text-white px-6 py-4 shadow">
      <img
        alt="Внутренний проект по интеграции прайсов"
        src="assets/logo.png"
        className="h-10"
      />

      <div className="relative">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setShowLogin(!showLogin)}
        >
          Авторизоваться
        </button>

        {showLogin && (
          <div className="absolute right-0 mt-5 w-64 bg-white text-black shadow-lg rounded p-4 z-10">
            <h3 className="text-lg font-semibold mb-2">Вход</h3>
            <input
              type="text"
              placeholder="Логин"
              className="w-full mb-2 p-2 border rounded"
              value={login}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              className="w-full mb-2 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
              onClick={handleLogin}
            >
              Войти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
