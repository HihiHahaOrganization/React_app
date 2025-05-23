import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-orange-400 text-white px-6 py-4 shadow">
      <div className="text-xl font-bold">
        <img  alt="Внутренний проект по интеграции прайсов внешних поставщиков с внутренней формой запроса" src="assets/logo.png" />
      </div>
    </header>
  );
}