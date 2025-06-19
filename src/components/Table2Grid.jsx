import React, { useState, useEffect } from 'react';
import { checkPosition } from '../api/checkPosition';
import { getUserSessionTmc } from '../api/getUserSessionTmc';
import { getUserSessionAdditionalInfo } from '../api/getUserSessionAdditionalInfo';
import { addPosition } from '../api/addPosition';

const headersMap = [
  { key: 'number', label: '№' },
  { key: 'articul', label: 'Артикул' },
  { key: 'name', label: 'Наименование' },
  { key: 'quantity', label: 'Кол-во' },
  { key: 'measure', label: 'Ед. изм.' },
  { key: 'characteristic', label: 'Характеристика'},
  { key: 'vendor', label: 'Поставщик' },
  { key: 'responsiblePerson', label: 'ФИО отв.МпЗ'},
  { key: 'price', label: 'Входная цена за единицу с учетом НДС. Ставка НДС указана в колонке 13' },
  { key: 'retailPrice', label: 'Розничная цена за единицу с учетом НДС. Ставка НДС указана в колонке 13'},
  { key: 'regularDiscount', label: 'Размер регулярной скидки (%)'},
  { key: 'currency', label: 'Валюта' },
  { key: 'vat', label: 'НДС' },
  { key: 'deliveryDate', label: 'Срок поставки'},
  { key: 'supplier', label: 'Поставщик' },
  { key: 'invoiceNumber', label: '№ счёта'},
  { key: 'deliveryTime', label: 'Желаемая дата поставки' },
  { key: 'paymentMethod', label: 'Способ расчета с поставщиком (100% предоплата или отсрочка - указать: сколько к/дней)'},
  { key: 'note', label: 'Примечания'}
];

export default function Table2Grid({ data, onNext, onPrev, userSessionId }) {
  const [rows, setRows] = useState({ products: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data.products)) {
      setRows({
        products: data.products.filter(item => item.isCorrect)
      });
    } else {
      setRows({ products: [] });
      console.error('Table2Grid: data.products is not an array', data);
    }
  }, [data]);

  const handleChange = (index, key, value) => {
    setRows(prev => {
      const newProducts = [...prev.products];
      newProducts[index] = { ...newProducts[index], [key]: value };
      return { ...prev, products: newProducts };
    });
  };

  const handleSubmitNext = async () => {
    try {
      setIsSubmitting(true);
      console.log('Отправка данных:', rows);
      await addPositions(userSessionId, rows)
      await getUserSessionAdditionalInfo(userSessionId);
      onNext(rows);
    } catch (error) {
      alert('Ошибка при отправке данных: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPrices = async () => {
    try {
      setIsSubmitting(true);
      const updated = await checkPosition(userSessionId, { products: rows.products });
  
      // Обновляем rows.products, чтобы таблица перерисовалась
      if (updated && Array.isArray(updated.products)) {
        setRows({ products: updated.products });
      } else {
        alert('Сервер вернул некорректные данные');
      }
    } catch (error) {
      alert('Ошибка при актуализации товаров: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPrev = async () => {
    try {
      setIsSubmitting(true);
      console.log('Отправка данных:', rows);
      await addPositions(userSessionId, rows)
      await getUserSessionTmc(userSessionId);
      onPrev(rows);
    } catch (error) {
      alert('Ошибка при отправке данных: ' + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Универсальный запрос</h2>
      </div>

      <div className="h-[70vh] overflow-x-auto overflow-y-auto border border-gray-300 rounded">
        <table className="min-w-max border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {headersMap.map(({ label }, idx) => (
                <th key={idx} className="border px-2 py-1 text-sm text-left bg-gray-100">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.products.map((row, rowIdx) => (
              <tr key={rowIdx} className="even:bg-gray-50">
                {headersMap.map(({ key }, colIdx) => (
                  <td key={colIdx} className="border px-3 py-1">
                    <input
                      type="text"
                      className="w-full border-none bg-transparent focus:outline-none"
                      value={row[key] || ''}
                      onChange={e => handleChange(rowIdx, key, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <button 
          className="bg-orange-400 text-white px-3 py-2 rounded" 
          onClick={handleSubmitPrev}
          disabled={isSubmitting}
        >
          Назад
        </button>
        <button 
          className="bg-orange-400 text-white px-3 py-2 rounded" 
          onClick={handleSubmitPrices}
          disabled={isSubmitting}
        >
          Актуализировать товары
        </button>
        <button 
          className="bg-orange-400 text-white px-4 py-2 rounded" 
          onClick={handleSubmitNext}
          disabled={isSubmitting}
        >
          Далее
        </button>
      </div>
    </div>
  );
}