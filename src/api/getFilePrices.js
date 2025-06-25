import {BASE_URL} from './config'

export const getFilePrices = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/getFilePrices?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  const blob = await response.blob(); // <-- получаем файл в виде Blob
  return blob;
};