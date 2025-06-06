const BASE_URL = "https://localhost:7156/PriceAgregator";

export const getUserSessionTmc = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getUserSessionTmc?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};