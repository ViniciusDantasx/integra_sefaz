import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function RelatoriosPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-sefaz-background-light">
      <header className="bg-white p-6 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-sefaz-blue">Relatórios</h1>
      </header>
      {/* ATUALIZAÇÃO: Ajuste de classes para centralizar */}
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-6">
        <div>
          <BarChart3 size={64} className="mx-auto" /> {/* Adicionado mx-auto para centralizar o ícone */}
          <h2 className="mt-4 text-xl font-semibold">Módulo de Relatórios</h2>
          <p>(Em construção)</p>
        </div>
      </div>
    </div>
  );
}