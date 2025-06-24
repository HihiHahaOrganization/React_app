const BASE_URL = "https://localhost:7156/Auth";

export const getUserSessionStatus = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/getUserSessionStatus?userSessionId=${userSessionId}`);

  if (!response.ok) {
    throw new Error("Ошибка при получении статуса сессии");
  }

  return await response.json();
};