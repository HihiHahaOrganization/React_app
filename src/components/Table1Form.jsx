import React, { useState, useEffect } from 'react';
import { addUserSessionTmc } from '../api/addUserSessionTmc';

const labels = {
  requestDate: 'Дата запроса',
  legalEntity: 'Юридическое лицо',
  projectName: 'Название проекта',
  contractNumber: 'Номер договора',
  contractorName: 'Контрагент',
  customerPaymentTerms: 'Условия оплаты заказчика',
  deliveryAddress: 'Адрес доставки',
  needDeferredPayment: 'Нужна отсрочка платежа',
  department: 'Отдел',
  crmDealNumber: 'Номер сделки CRM',
  needOfferValidity: 'Нужна ли валидность предложения',
  previousPricingTaskNumber: 'Номер предыдущей задачи на прайсинг',
  projectManager: 'Руководитель проекта',
  requestResponsible: 'Ответственный за запрос'
};

export default function Table1Form({ data, onNext, onChange, userSessionId }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (key, value) => {
    const updated = {
      ...formData,
      [key]: value,
    };
    setFormData(updated);
    if (onChange) onChange(updated); // проброс наверх
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log('Отправка данных:', formData);
      await addUserSessionTmc(userSessionId, formData);
      onNext(formData); // переход только после успешной отправки
    } catch (error) {
      alert('Ошибка при отправке данных: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Запрос на ТМЦ</h2>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="grid grid-cols-2 gap-2 mb-2">
          <label className="font-medium">{labels[key] || key}</label>
          <input
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border p-1"
          />
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-400 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Далее'}
        </button>
      </div>
    </div>
  );
}