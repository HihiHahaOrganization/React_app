import {BASE_URL} from './config'

export const getUserSessionTmc = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/getUserSessionTmc?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};