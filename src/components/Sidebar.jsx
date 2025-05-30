import React from 'react';

export default function Sidebar({ currentStep, setStep }) {
  return (
    <div className="w-56 bg-gray-100 p-4 border-r min-h-screen-60">
      <ul className="space-y-2 space-x-0">
        {/* <li><text className={currentStep === 1 ? "bg-orange-300 text-gray px-4 py-2 rounded" : ""} onClick={() => setStep(1)}>Запрос на ТМЦ</text></li>
        <li><text className={currentStep === 2 ? "bg-orange-300 text-gray px-4 py-2 rounded" : ""} onClick={() => setStep(2)}>Запрос</text></li>
        <li><text className={currentStep === 3 ? "bg-orange-300 text-gray px-4 py-2 rounded" : ""} onClick={() => setStep(3)}>Доп инфомация</text></li> */}
        <li className={(currentStep === 1 || currentStep === 2 || currentStep === 3)? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>1. Запрос на ТМЦ</li>
        <li className={(currentStep === 2 || currentStep === 3 )? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>2. Запрос</li>
        <li className={(currentStep === 3 )? "bg-orange-400 text-gray px-4 py-2 rounded" : ""}>3. Доп инфомация</li>
      </ul>
    </div>
  );
}