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

const initialFormData = Object.keys(labels).reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {});

export default function Table1Form({ onNext, onChange, userSessionId }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userSessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getUserSessionTmc(userSessionId);
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Запрос на ТМЦ</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="grid grid-cols-5 gap-4 items-center">
            <label className="col-span-2 font-medium text-gray-700 text-right pr-4">
              {label}
            </label>
            <div className="col-span-3">
              <input
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSubmitting}
          className={`px-8 py-3 rounded-md text-white font-medium text-lg ${
            isLoading || isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 transition-colors'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Далее'}
        </button>
      </div>
    </div>
  );
}