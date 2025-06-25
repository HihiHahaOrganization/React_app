import {BASE_URL} from './config'

export const login = async (login, password) => {
    const response = await fetch(`${BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

  if (!response.ok) {
    throw new Error("Ошибка при аутентификации");
  }

  return await response.json();
};

