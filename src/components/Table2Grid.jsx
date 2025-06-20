import React, { useState, useEffect } from 'react';
import { checkPositions } from '../api/checkPositions';
import { addPositions } from '../api/addPositions';
import { getProducts } from '../api/getProducts'; // Предполагается, что такой API-метод существует

const headersMap = [
  { key: 'number', label: '№' },
  { key: 'articul', label: 'Артикул' },
  { key: 'name', label: 'Наименование' },
  { key: 'quantity', label: 'Кол-во' },
  { key: 'measure', label: 'Ед. изм.' },
  { key: 'characteristic', label: 'Характеристика'},
  { key: 'vendor', label: 'Вендор' },
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

export default function Table2Grid({ onNext, onPrev, userSessionId }) {
  const [rows, setRows] = useState({ products: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts(userSessionId); // Запрашиваем данные с сервера
        if (response && Array.isArray(response.products)) {
          setRows({ products: response.products });
        }
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        alert('Не удалось загрузить данные: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userSessionId) {
      loadProducts();
    }
  }, [userSessionId]);

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
      await checkPositions(userSessionId, rows);
      onNext(rows); // Передаем актуальные данные дальше
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
      const updated = await checkPositions(userSessionId, { products: rows.products });
      
      // Проверяем ответ и обновляем состояние
      if (updated && Array.isArray(updated.products)) {
        setRows({ products: updated.products }); // Обновляем данные
        console.log(updated.products); 
      } else {
        console.error('Некорректный формат ответа:', updated);
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPrev = async () => {
    try {
      setIsSubmitting(true);
      await checkPositions(userSessionId, rows);
      onPrev(rows); // Передаем актуальные данные назад
    } catch (error) {
      alert('Ошибка при отправке данных: ' + error.message);
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