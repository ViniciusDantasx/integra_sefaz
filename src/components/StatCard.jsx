import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Componente reutilizável para mostrar um KPI no Dashboard.
 * * Props:
 * - icon: O componente de ícone (ex: <User />)
 * - title: O título do card (ex: "Atendimentos Totais")
 * - value: O valor principal (ex: "1,204")
 * - trendValue: O valor da tendência (ex: "+5.2%")
 * - trendDirection: 'up' ou 'down' (para a cor e o ícone da tendência)
 */
export default function StatCard({ icon, title, value, trendValue, trendDirection = 'up' }) {
  
  const isUp = trendDirection === 'up';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex-1">
      {/* Linha 1: Ícone e Título */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-sefaz-background rounded-full">
          {/* Renderiza o ícone passado como prop */}
          {React.cloneElement(icon, { className: "w-5 h-5 text-sefaz-blue" })}
        </div>
      </div>
      
      {/* Linha 2: Valor Principal */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{value}</h2>
      
      {/* Linha 3: Tendência */}
      <div className="flex items-center space-x-1 text-sm">
        <span className={`flex items-center font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </span>
        <span className="text-gray-400">vs. mês anterior</span>
      </div>
    </div>
  );
}