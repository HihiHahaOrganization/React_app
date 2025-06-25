import {BASE_URL} from './config'

export const getUserSessionAdditionalInfo = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/getUserSessionAdditionalInfo?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};