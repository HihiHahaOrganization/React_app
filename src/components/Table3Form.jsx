import React, { useState, useEffect } from 'react';

const columnLabels = {
  needSpecialPrices: "Нужны ли спеццены",
  includeDeliveryCost: "Нужно ли указывать стоимость доставки при прайсинге. Если нужно, необходимо указать пункт доставки",
  desiredResponseDate: "Желаемая дата получения ответа",
  desiredResponseForm: "Желаемая форма получения ответа",
  comment: "Примечание",
  customerFullName: "Полное наименование заказчика",
  isTenderPreparation: "Проводится ли запрос цен на данном прайсинге в рамках подготовки к конкурсу. Если да, то к какому",
  tenderDates: "Срок проведения конкурса",
  applicationDeadline: "крайняя дата подачи заявки на конкурс",
  deliveryDeadline: "Срок поставки товара по конкурсу",
  preparedBy: "Кто готовил ТЗ"
};

export default function Table3Form({ data, onSubmit }) {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const arr = Object.entries(data).map(([key, value]) => ({
        key,
        label: columnLabels[key] || key,
        value: value || ''
      }));
      setFormData(arr);
    } else if (Array.isArray(data)) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (index, newValue) => {
    const updated = [...formData];
    updated[index].value = newValue;
    setFormData(updated);
  };

  const handleSubmit = () => {
    const result = formData.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
    if (onSubmit) onSubmit(result);
  };

  if (!formData.length) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Дополнительная информация</h2>
      <div className="space-y-4">
        {formData.map((row, index) => (
          <div key={row.key} className="flex gap-4 items-center">
            <label className="w-1/2 font-medium">{row.label}</label>
            <input
              className="flex-1 border p-2 rounded"
              type="text"
              value={row.value}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Сформировать запрос
        </button>
      </div>
    </div>
  );
}
