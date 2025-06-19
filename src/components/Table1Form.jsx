import React, { useState, useEffect } from 'react';
import { addUserSessionTmc } from '../api/addUserSessionTmc';
import { getUserSessionTmc } from '../api/getUserSessionTmc';

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

// Начальные значения формы
const initialFormData = Object.keys(labels).reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {});

export default function Table1Form({ onNext, onChange, userSessionId }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    const fetchData = async () => {
      if (!userSessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getUserSessionTmc(userSessionId);
        
        // Объединяем полученные данные с начальными значениями
        const mergedData = { ...initialFormData, ...data };
        setFormData(mergedData);
        
        if (onChange) onChange(mergedData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        alert('Не удалось загрузить данные формы');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userSessionId]);

  const handleChange = (key, value) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const handleSubmit = async () => {
    if (!userSessionId) return;

    try {
      setIsSubmitting(true);
      await addUserSessionTmc(userSessionId, formData);
      if (onNext) onNext();
    } catch (error) {
      alert('Ошибка отправки: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Загрузка данных...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Запрос на ТМЦ</h2>
      
      <div className="space-y-4 max-w-2xl mx-auto">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="font-medium md:text-right">{label}</label>
            <input
              value={formData[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border p-2 rounded col-span-2"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSubmitting}
          className={`px-6 py-2 rounded text-white font-medium ${
            isLoading || isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-400 hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Далее'}
        </button>
      </div>
    </div>
  );
}