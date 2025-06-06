// src/api/priceApi.js

const BASE_URL = "https://localhost:7156/PriceAgregator";

export const getFilePrices = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getFilePrices?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};
// Прилетает готовый файл, не json