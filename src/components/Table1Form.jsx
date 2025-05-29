import React, { useState, useEffect } from 'react';

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

export default function Table1Form({ data, onNext }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Запрос на ТМЦ</h2>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="grid grid-cols-2 gap-2 mb-2">
          <label className="font-medium">{labels[key] || key}</label>
          <input
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            className="border p-1"
          />
        </div>
      ))}
      <div className="flex justify-end items-right mt-4">
        <button onClick={() => {
        console.log(JSON.stringify(formData,null,2));
        onNext(formData);
        }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Далее
      </button></div>
      
    </div>
  );
}