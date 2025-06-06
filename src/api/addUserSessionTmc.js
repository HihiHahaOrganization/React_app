const BASE_URL = "https://localhost:7156/PriceAgregator";

export const addUserSessionTmc = async (userSessionId, tmcDto) => {
  const response = await fetch(`${BASE_URL}/addUserSessionTmc?userSessionId=${userSessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tmcDto)
  });

  if (!response.ok) {
    throw new Error("Ошибка при добавлении TMC");
  }

  return await response.json();
};