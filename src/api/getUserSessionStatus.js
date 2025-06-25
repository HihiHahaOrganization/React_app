import {BASE_URL} from './config'

export const getUserSessionStatus = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/Auth/getUserSessionStatus?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении статуса сессии");
  }

  return await response.json();
};