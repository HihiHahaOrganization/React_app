import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { addFeedback } from '../api/addFeedback';

export default function Header({ setUserSessionId }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [login, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(Cookies.get('userSessionId') || '');

  useEffect(() => {
    if (userId) {
      setUserSessionId(userId);
    }
  }, [userId, setUserSessionId]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://localhost:7156/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok && data.userSessionId) {
        setUserSessionId(data.userSessionId);
        Cookies.set('userSessionId', data.userSessionId);
        setUserId(data.userSessionId);
        setUsername('');
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

  const handleLogout = () => {
    Cookies.remove('userSessionId');
    setUserSessionId('');
    setUserId('');
  };

  const handleSendFeedback = async () => {
    try {
      if (!feedbackText.trim()) {
        alert('Пожалуйста, введите текст отзыва');
        return;
      }
  
      await addFeedback({ message: feedbackText }); // ← Оборачиваем в объект с ключом "message"
      console.log(feedbackText)
      alert('Спасибо за ваш отзыв!');
      setFeedbackText('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      
    }
  };
  

  return (
    <header className="flex justify-between items-center bg-orange-400 text-white px-6 py-4 shadow relative">
      {/* Левая часть: Кнопка обратной связи */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-1 rounded"
          onClick={() => setShowFeedback(true)}
        >
          Обратная связь
        </button>
      </div>

      {/* Правая часть */}
      <div className="flex items-center space-x-4">
        {userId ? (
          <>
            <span className="text-white">Вы вошли</span>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
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
        )}
      </div>

      {/* Модальное окно формы обратной связи */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            className="bg-white rounded shadow-lg resize overflow-hidden min-w-[300px] min-h-[250px] max-w-[90%] max-h-[80%] relative flex flex-col"
            style={{ resize: 'both' }}
          >
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h2 className="text-lg font-bold text-black">Форма обратной связи</h2>
              <button
                className="text-gray-500 hover:text-black text-xl"
                onClick={() => setShowFeedback(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <textarea
                className="w-full h-full p-2 border rounded resize-none placeholder-black text-black"
                placeholder="Введите ваш отзыв или предложение..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <div className="border-t p-4">
              <button
                className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
                onClick={handleSendFeedback}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
