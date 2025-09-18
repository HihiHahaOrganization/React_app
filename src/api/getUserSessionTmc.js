const BASE_URL = "http://localhost:5000/PriceAgregator";

export const getUserSessionTmc = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getUserSessionTmc?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};