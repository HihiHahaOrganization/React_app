import React, { useState, useEffect } from 'react';
import { getUserSessionAdditionalInfo } from '../api/getUserSessionAdditionalInfo';

const columnLabels = {
  needSpecialPrices: "Нужны ли спеццены",
  includeDeliveryCost: "Нужно ли указывать стоимость доставки при прайсинге. Если нужно, необходимо указать пункт доставки",
  desiredResponseDate: "Желаемая дата получения ответа",
  desiredResponseForm: "Желаемая форма получения ответа",
  comment: "Примечание",
  customerFullName: "Полное наименование заказчика",
  isTenderPreparation: "Проводится ли запрос цен на данном прайсинге в рамках подготовки к конкурсу. Если да, то к какому",
  tenderDates: "Срок проведения конкурса",
  applicationDeadline: "Крайняя дата подачи заявки на конкурс",
  deliveryDeadline: "Срок поставки товара по конкурсу",
  preparedBy: "Кто готовил ТЗ"
};

export default function Table3Form({ userSessionId, onSubmit, onPrev }) {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadAdditionalInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getUserSessionAdditionalInfo(userSessionId);
        
        if (data && typeof data === 'object') {
          // Фильтруем данные, исключая userSessionId и другие нежелательные поля
          const filteredData = Object.entries(data)
            .filter(([key]) => columnLabels.hasOwnProperty(key))
            .map(([key, value]) => ({
              key,
              label: columnLabels[key],
              value: value || ''
            }));
          
          setFormData(filteredData);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Создаем пустую форму на основе columnLabels при ошибке
        const emptyForm = Object.keys(columnLabels).map(key => ({
          key,
          label: columnLabels[key],
          value: ''
        }));
        setFormData(emptyForm);
      } finally {
        setIsLoading(false);
      }
    };

    if (userSessionId) {
      loadAdditionalInfo();
    } else {
      // Если нет userSessionId, создаем пустую форму
      const emptyForm = Object.keys(columnLabels).map(key => ({
        key,
        label: columnLabels[key],
        value: ''
      }));
      setFormData(emptyForm);
      setIsLoading(false);
    }
  }, [userSessionId]);

  const handleChange = (key, value) => {
    setFormData(prev =>
      prev.map(item =>
        item.key === key ? { ...item, value } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = formData.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});
      
      if (onSubmit) {
        await onSubmit(result);
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Ошибка при формировании запроса');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Загрузка данных...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Дополнительная информация</h2>
      <div className="space-y-4">
        {formData.map((row) => (
          <div key={row.key} className="flex gap-4 items-center">
            <label className="w-1/2 font-medium">{row.label}</label>
            <input
              className="flex-1 border p-2 rounded"
              type="text"
              value={row.value}
              onChange={(e) => handleChange(row.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-orange-400 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={onPrev}
          disabled={isSubmitting}
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          className="bg-orange-400 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Сформировать запрос'}
        </button>
      </div>
    </div>
  );
}