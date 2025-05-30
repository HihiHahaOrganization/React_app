import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Header({ setUserSessionId }) {
  const [showLogin, setShowLogin] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://localhost:7156/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();
      console.log('Ответ от сервера:', data);

      if (response.ok && data.userSessionId) {
        setUserSessionId(data.userSessionId);
        Cookies.set('userSessionId', data.userSessionId);
        Cookies.set('username', login); // сохраняем логин
        setLoggedInUser(login);
        setLogin('');
        setPassword('');
        setShowLogin(false);
      } else {
        alert('Неверный логин или пароль');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при попытке авторизации');
    }
  };

  // При загрузке страницы достаем логин из куки
  useEffect(() => {
    const usernameFromCookie = Cookies.get('username');
    if (usernameFromCookie) {
      setLoggedInUser(usernameFromCookie);
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-orange-400 text-white px-6 py-4 shadow">
      <img
        alt="Внутренний проект по интеграции прайсов"
        src="assets/logo.png"
        className="h-10"
      />

      <div className="relative">
        {loggedInUser ? (
          <div className="text-lg font-semibold">
            Здравствуйте, {loggedInUser}
          </div>
        ) : (
          <>
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
                  onChange={(e) => setLogin(e.target.value)}
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
          </>
        )}
      </div>
    </header>
  );
}