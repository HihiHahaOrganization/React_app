import {BASE_URL} from './config'

export const getProducts = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/getProducts?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};