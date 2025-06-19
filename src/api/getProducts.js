const BASE_URL = "https://localhost:7156/PriceAgregator";

export const getProducts = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getProducts?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};