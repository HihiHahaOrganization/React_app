// src/api/priceApi.js

const BASE_URL = "http://localhost:5000/PriceAgregator";

export const getFilePrices = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getFilePrices?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};
