import {BASE_URL} from './config'


export const addPositions = async (userSessionId, formDto) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/addPositions?userSessionId=${userSessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formDto)
  });

  if (!response.ok) {
    throw new Error("Ошибка при проверке позиций");
  }

  return await response.json();
};
