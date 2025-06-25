import {BASE_URL} from './config'

export const addFeedback = async (message) => {
    const response = await fetch(`${BASE_URL}/Admin/addFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
  
    if (!response.ok) {
      throw new Error("Ошибка при отправке сообщения");
    }
  
    // Если сервер не возвращает тело ответа, считаем успешным
    return; // или return null;
  };