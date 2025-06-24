import React from 'react';
import Cookies from 'js-cookie';
import { createUserSession } from '../api/createUserSession';


export default function Sidebar({ currentStep, setStep, setUserSessionId, userSessionId }) {
  const handleReset = async () => {
    try {
      const { userSessionId: newSessionId } = await createUserSession(userSessionId); // деструктурируем ответ
  
      Cookies.set('userSessionId', newSessionId); // записываем в куки
      setUserSessionId(newSessionId);             // обновляем стейт
      setStep(0);                                 // возвращаемся на первый экран
    } catch (error) {
      alert('Ошибка при создании новой сессии: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="w-58 bg-gray-100 p-4 border-r h-screen-72 flex flex-col justify-between">
      <ul className="space-y-2">
        <li className={(currentStep >= 1) ? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>
          1. Запрос на ТМЦ
        </li>
        <li className={(currentStep >= 2) ? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>
          2. Запрос
        </li>
        <li className={(currentStep === 3) ? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>
          3. Доп информация
        </li>
      </ul>

      <button
        onClick={handleReset}
        className="mt-8 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Начать заново
      </button>
    </div>
  );
}
