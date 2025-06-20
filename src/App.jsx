import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Table1Form from './components/Table1Form';
import Table2Grid from './components/Table2Grid';
import Table3Form from './components/Table3Form';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { addUserSessionTmc } from './api/addUserSessionTmc';
import { checkPositions } from './api/checkPositions';
import { addUserSessionAdditionalInfo } from './api/addUserSessionAdditionalInfo';



export default function App() {
  const [userSessionId, setUserSessionId] = useState(null); 
  const [step, setStep] = useState(0);
  const [jsonFiles, setJsonFiles] = useState({ TMC: null, UR: null, addInfo: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedUR, setVerifiedUR] = useState(null);


  useEffect(() => {
    const saved = Cookies.get('userSessionId');
    if (saved) {
      setUserSessionId(saved);
    }
  }, []);

  const handleFile = (e) => {
    if (!userSessionId) return;
    const file = e.target.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      const allRows = XLSX.utils.sheet_to_json(sheet1, { header: 1, defval: '' });

      const TMC = parseTMC(sheet1);
      const UR = parseURProducts(sheet1);
      const addInfo = parseAddInfo(sheet1, allRows);
      console.log(TMC)
      console.log(UR)
      console.log(addInfo)

      
  try {
    setIsSubmitting(true);

    await addUserSessionTmc(userSessionId, TMC); 
    const verifiedData = await checkPositions(userSessionId, UR); 
    await addUserSessionAdditionalInfo(userSessionId, addInfo); 

    setStep(1);
  } catch (error) {
    alert('Ошибка при загрузке данных: ' + error.message);
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
      // try {
      //   setIsSubmitting(true);
      //   console.log('Отправка данных:', UR);
      //   await addPositions(userSessionId, UR);
      // } catch (error) {
      //   alert('Ошибка при отправке данных: ' + error.message);
      //   console.error(error);
      // } finally {
      //   setIsSubmitting(false);
      // }

      setJsonFiles({ TMC, UR:verifiedUR, addInfo });
      setStep(1);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseTMC = (sheet) => {
    const excelSerial = sheet['C2']?.v || 0;
    const baseDate = new Date(1900, 0, 1);
    const date = new Date(baseDate.getTime() + (excelSerial - 1) * 86400000);

    return {
      requestDate: date.toISOString().split('T')[0],
      legalEntity: sheet['C3']?.v || '',
      projectName: sheet['C4']?.v || '',
      contractNumber: sheet['C5']?.v || '',
      contractorName: sheet['C6']?.v || '',
      customerPaymentTerms: sheet['C7']?.v || '',
      deliveryAddress: sheet['C8']?.v || '',
      needDeferredPayment: sheet['C9']?.v || '',
      department: sheet['C10']?.v || '',
      crmDealNumber: sheet['C11']?.v || '',
      needOfferValidity: sheet['C12']?.v || '',
      previousPricingTaskNumber: sheet['C13']?.v || '',
      projectManager: sheet['C14']?.v || '',
      requestResponsible: sheet['C15']?.v || '',
    };
  };

  const parseURProducts = (sheet) => {
    const products = [];
    for (let row = 21; ; row++) {
      const numberCell = sheet[`A${row}`];
      if (!numberCell || isNaN(numberCell.v)) break;

      products.push({
        number: numberCell.v,
        articul: String(sheet[`B${row}`]?.v || ''),
        name: sheet[`C${row}`]?.v || '',
        quantity: sheet[`D${row}`]?.v || 0,
        measure: sheet[`E${row}`]?.v || '',
        characteristic: sheet[`F${row}`]?.v || '',
        vendor: sheet[`G${row}`]?.v || '',
        responsiblePerson: '',
        price: 0,
        retailPrice: '',
        regularDiscount: '',
        currency: '',
        vat: '',
        deliveryDate: '',
        supplier: '',
        invoiceNumber: '',
        deliveryTime: '',
        paymentMethod: '',
        note: '',
        isCorrect: true,
      });
    }

    return { products };
  };

  const handleSubmitPrices = async () => {
      try {
        setIsSubmitting(true);
        console.log('Отправка данных:', UR);
        await addPosition(userSessionId, UR);
      } catch (error) {
        alert('Ошибка при отправке данных: ' + error.message);
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    };


  // console.log(products);
  const parseAddInfo = (sheet, allRows) => {
    let startRow = allRows.findIndex(row => row[0] === 'Нужны ли спеццены') + 1;
    if (startRow === 0) startRow = 999; // fallback if not found

    const excelSerial = sheet[`C${startRow + 2}`]?.v || 0;
    const baseDate = new Date(1900, 0, 1);
    const date1 = new Date(baseDate.getTime() + (excelSerial - 1) * 86400000);

    return {
      needSpecialPrices: sheet[`C${startRow}`]?.v || '',
      includeDeliveryCost: sheet[`C${startRow + 1}`]?.v || '',
      desiredResponseDate: date1.toISOString(),
      desiredResponseForm: sheet[`C${startRow + 3}`]?.v || '',
      comment: sheet[`C${startRow + 4}`]?.v || '',
      customerFullName: sheet[`C${startRow + 7}`]?.v || '',
      isTenderPreparation: sheet[`C${startRow + 8}`]?.v || '',
      tenderDates: sheet[`C${startRow + 9}`]?.v || '',
      applicationDeadline: sheet[`C${startRow + 10}`]?.v || '',
      deliveryDeadline: sheet[`C${startRow + 11}`]?.v || '',
      preparedBy: sheet[`C${startRow + 12}`]?.v || '',
    };
  };
  const updateTMC = (newTMC) => {
    setJsonFiles(prev => ({
      ...prev,
      TMC: newTMC,
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header setUserSessionId={setUserSessionId} />
      <div className="flex flex-1">
        {step > 0 && <Sidebar currentStep={step} setStep={setStep} />}
        <main className="flex-1 overflow-auto">
          {step === 0 && (
            <div className="h-full flex flex-col justify-center items-center">
              <label
  className={`px-20 py-4 rounded-xl shadow-md transition duration-200 text-white
    ${userSessionId
      ? 'cursor-pointer bg-orange-300 hover:bg-orange-700'
      : 'cursor-not-allowed bg-gray-400'}
  `}
>
                Загрузите файл универсального запроса
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFile}
                  className="hidden"
                  disabled={!userSessionId}
                />
              </label>
            </div>
          )}
          {step === 1 && (
  <Table1Form 
    onNext={() => setStep(2)} 
    onChange={updateTMC} // передаем функцию обновления
    userSessionId = {userSessionId}
  />
)}
          {step === 2 && (
            <Table2Grid
              
              onNext={() => setStep(3)}
              onPrev={() => setStep(1)}
              userSessionId={userSessionId}

            />
          )}
          {step === 3 && 
          <Table3Form 
              userSessionId={userSessionId}
              onPrev={() => setStep(2)} />}
        </main>
      </div>
    </div>
  );
}
