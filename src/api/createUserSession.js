import {BASE_URL} from './config'

export const createUserSession = async (userSessionId) => {
  const response = await fetch(`${BASE_URL}/Auth/createUserSession?userSessionId=${userSessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userSessionId)
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании новой сессии");
  }

  return await response.json();
};