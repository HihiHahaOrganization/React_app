import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Table1Form from './components/Table1Form';
import Table2Grid from './components/Table2Grid';
import Table3Form from './components/Table3Form';


export default function App() {
  const [userSessionId, setUserSessionId] = useState(null); 
  const [step, setStep] = useState(0);
  const [jsonFiles, setJsonFiles] = useState({
    TMC: null,
    UR: null,
    addInfo: null
  });
  
  const [excelData, setExcelData] = useState(null);
  
  const handleFile = (e) => {
    const file = e.target.files[0];
    // if (!file || !userSessionId) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      const all = XLSX.utils.sheet_to_json(sheet1, { header: 1, defval: '' });

      // Таблица 1
      
    let formattedDate = '';

  

    

    let excelSerial = sheet1['C2'].v;
let baseDate = new Date(1900, 0, 1); // Excel epoch (1 Jan 1900)
let date = new Date(baseDate.getTime() + (excelSerial - 1) * 86400000);
let options = { day: 'numeric', year: 'numeric', month: 'numeric' };
  // Table 1
  const TMC = {
    requestDate: date.toLocaleDateString("en-US", options) || '',
    legalEntity: sheet1[`C${3}`]?.v || '',
    projectName: sheet1[`C${4}`]?.v || '',
    contractNumber: sheet1[`C${5}`]?.v || '',
    contractorName: sheet1[`C${6}`]?.v || '',
    customerPaymentTerms: sheet1[`C${7}`]?.v || '',
    deliveryAddress: sheet1[`C${8}`]?.v || '',
    needDeferredPayment: sheet1[`C${9}`]?.v || '',
    department: sheet1[`C${10}`]?.v || '',
    crmDealNumber: sheet1[`C${11}`]?.v || '',
    needOfferValidity: sheet1[`C${12}`]?.v || '',
    previousPricingTaskNumber: sheet1[`C${13}`]?.v || '',
    projectManager: sheet1[`C${14}`]?.v || '',
    requestResponsible: sheet1[`C${15}`]?.v || ''
  };


      // Таблица 2
      const t2Start = 19;
      const t2Headers = all[t2Start];
      const UR = { products: [] };
  for (let row = 21; ; row++) {
    const cell = sheet1[`A${row}`];
    if (!cell || isNaN(cell.v)) {break};
    const entry = {
      number: cell.v,                                         //№ да
      articul: sheet1[`B${row}`]?.v || '',                    //Артикул да
      name: sheet1[`C${row}`]?.v || '',                       //Наименование да
      quantity: sheet1[`D${row}`]?.v || 0,                    //Кол-во да
      measure: sheet1[`E${row}`]?.v || '',                    //Ед. Измерения да 
      characteristic: sheet1[`F${row}`]?.v || '',             //Характеристика да
      vendor: sheet1[`G${row}`]?.v || '',                     //Вендор да
      responsiblePerson: '',                                  //Фио. отв.Мп3
      price:  0,                                              //Входная цена
      retailPrice:  '',                                       //Розничная цена
      regularDiscount:  '',                                   //Размер регулярной скидки
      currency:  '',                                          //Валюта
      vat:  '',                                               //НДС
      deliveryDate:  '',                                      //Срок поставки
      supplier:  '',                                          //Поставщик
      invoiceNumber: '',                                      //№ Счета
      deliveryTime:  '',                                      //Желаемая дата поставки
      paymentMethod: '',                                      //Способ расчета
      note:  '',                                              //Примечания
      isCorrect: true,                                        //Флаг отрисовки
    };
    UR.products.push(entry);
  }
      console.log("Headers from Excel:", t2Headers);



      let startRow;
  for (let i = 1; i < 1000; i++) {
    if ((sheet1[`A${i}`]?.v || '') === 'Нужны ли спеццены') {
      startRow = i
      console.log(i, "table3start");
      break;
    }
  }
  const addInfo = {
    needSpecialPrices: sheet1[`C${startRow}`]?.v || '',
    includeDeliveryCost: sheet1[`C${startRow+1}`]?.v || '',
    desiredResponseDate: sheet1[`C${startRow+2}`]?.v || '',
    desiredResponseForm: sheet1[`C${startRow+3}`]?.v || '',
    comment: sheet1[`C${startRow+4}`]?.v || '',
    customerFullName: sheet1[`C${startRow+7}`]?.v || '',
    isTenderPreparation: sheet1[`C${startRow+8}`]?.v || '',
    tenderDates: sheet1[`C${startRow+9}`]?.v || '',
    applicationDeadline: sheet1[`C${startRow+10}`]?.v || '',
    deliveryDeadline: sheet1[`C${startRow+11}`]?.v || '',
    preparedBy: sheet1[`C${startRow+12}`]?.v || ''
  };
  
  
  

      setJsonFiles({ TMC, UR, addInfo });
      setStep(1);
    };
    reader.readAsArrayBuffer(file);
  };

  // const buildJson = (table3Answers) => {
  //   const json = {
  //     data: excelData.t2Rows.map(r =>
  //       excelData.t2Headers.reduce((acc, h, i) => {
  //         acc[h] = r[i] ?? '';
  //         return acc;
  //       }, {})
  //     ),
  //     // additional: table3Answers // сохраняем ответы из таблицы 3
  //   };
  
  //   const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  //   const a = document.createElement('a');
  //   a.href = URL.createObjectURL(blob);
  //   a.download = 'request.json';
  //   a.click();
  // };
  

  return (
    <div className="flex flex-col h-screen">
      <Header setUserSessionId={setUserSessionId}/>
      <div className="flex flex-1">
        {step > 0 && <Sidebar currentStep={step} setStep={setStep} />}
        <main className="flex-1 overflow-auto">
        {step === 0 && (
          <div className="h-full flex flex-col justify-center items-center">
          <label className="cursor-pointer bg-orange-300 hover:bg-orange-700 text-white px-20 py-4 rounded-xl shadow-md transition duration-200">
            Загрузите файл универсального запроса
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFile}
                className="hidden"
                // disabled={!userSessionId}
              />
          </label>
      </div>
    )}
          {step === 1 && <Table1Form data={jsonFiles.TMC} onNext={() => setStep(2)} />}
          {step === 2 && <Table2Grid data={jsonFiles.UR.products} onNext={() => setStep(3)} onPrev={() => setStep(step - 1)} logInfo={jsonFiles.addInfo}  />}
          {step === 3 && <Table3Form data={jsonFiles.addInfo}  onPrev={() => setStep(step - 1)} />}
        </main>
      </div>
    </div>
  );
}

