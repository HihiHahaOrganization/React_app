import {BASE_URL} from './config'

export const addUserSessionAdditionalInfo = async (userSessionId, tmcDto) => {
  const response = await fetch(`${BASE_URL}/PriceAgregator/addUserSessionAdditionalInfo?userSessionId=${userSessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tmcDto)
  });

  if (!response.ok) {
    throw new Error("Ошибка при добавлении Дополнительной информации");
  }

  return await response.json();
};