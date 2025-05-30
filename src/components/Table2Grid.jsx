import React, { useState, useEffect } from 'react';

const headersMap = [
  { key: 'number', label: '№' },
  { key: 'articul', label: 'Артикул' },
  { key: 'name', label: 'Наименование' },
  { key: 'quantity', label: 'Кол-во' },
  { key: 'measure', label: 'Ед. изм.' },
  { key: 'characteristic', label: 'Характеристика'},
  { key: 'vendor', label: 'Поставщик' },
  { key: 'responsiblePerson',label:'ФИО отв.МпЗ'},
  { key: 'price', label: 'Входная цена за единицу с учетом НДС. Ставка НДС указана в колонке 13' },
  { key: 'retailPrice',label:'Розничная цена за единицу с учетом НДС. Ставка НДС указана в колонке 13'},
  { key: 'regularDiscount',label:'Размер регулярной скидки (%)'},
  { key: 'currency', label: 'Валюта' },
  { key: 'vat', label: 'НДС' },
  { key: 'deliveryDate',label:'Срок поставки'},
  { key: 'supplier', label: 'Поставщик' },
  { key: 'invoiceNumber',label:'№ счёта'},
  { key: 'deliveryTime', label: 'Желаемая дата поставки' },
  { key: 'paymentMethod',label:'Способ расчета с поставщиком (100% предоплата или отсрочка - указать: сколько к/дней)'},
  { key: 'note',label:'Примечания'}
];

export default function Table2Grid({ data, onNext, onPrev, logInfo }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRows(data.filter(item => item.isCorrect));
    } else {
      setRows([]); // или логир ошибки
      console.error('Table2Grid: data is not an array', data);
    }
  }, [data]);

  const handleChange = (index, key, value) => {
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [key]: value };
      return newRows;
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={() => onPrev(rows)}>Назад</button> */}
        <h2 className="text-xl font-semibold mb-4">Универсальный запрос</h2>
        {/* <button className="bg-blue-500 text-white px-3 py-2 rounded">Актуализировать товары</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onNext(rows)}>Далее</button> */}
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
      {rows.map((row, rowIdx) => (
        <tr key={rowIdx} className="even:bg-gray-50">
          {headersMap.map(({ key }, colIdx) => (
            <td key={colIdx} className="border px-3 py-1">
              <input
                type="text"
                className="w-full border-none bg-transparent focus:outline-none"
                value={row[key]}
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
        <button className="bg-orange-400 text-white px-3 py-2 rounded" onClick={() => onPrev(rows)}>Назад</button>
        <button className="bg-orange-400 text-white px-3 py-2 rounded">Актуализировать товары</button>
        <button className="bg-orange-400 text-white px-4 py-2 rounded" onClick={() => onNext(rows)}>Далее</button>
      </div>
    </div>
  );
}
