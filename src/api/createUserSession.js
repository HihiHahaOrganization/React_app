const BASE_URL = "http://localhost:5000/PriceAgregator";

export const createUserSession = async () => {
  const response = await fetch(`${BASE_URL}/createUserSession`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании сессии пользователя");
  }

  return await response.json(); // возвращает userSessionId
};