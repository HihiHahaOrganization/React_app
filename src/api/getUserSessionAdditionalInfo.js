const BASE_URL = "http://localhost:5000/PriceAgregator";

export const getUserSessionAdditionalInfo = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getUserSessionAdditionalInfo?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении цен из файла");
  }

  return await response.json();
};