import React from 'react';
import { Bot, Star, X } from 'lucide-react';

// Componente duplicado de RatingStars (para ser autossuficiente)
const RatingStars = ({ count, small = false }) => {
  return (
    <div className="flex items-center">
      {Array(5).fill(0).map((_, i) => (
        <Star 
          key={i} 
          className={`${small ? 'w-4 h-4' : 'w-5 h-5'} ${i < count ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={i < count ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

// O Modal
export default function HistoryModal({ ticket, atendente, onClose }) {
  if (!ticket) return null;

  return (
    // Overlay (fundo escuro)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Card do Modal (com flex-col e altura máxima) */}
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-2xl flex flex-col h-full max-h-[90vh]">
        
        {/* Cabeçalho do Modal */}
        <header className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-sefaz-blue">
              Histórico do Atendimento: {ticket.id}
            </h2>
            <p className="text-sm text-gray-500">
              Assunto: {ticket.assunto} | Data: {ticket.data}
            </p>
          </div>
          <button
            onClick={onClose}
            title="Fechar"
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
          >
            <X size={24} />
          </button>
        </header>

        {/* Log do Chat Histórico (com scroll interno) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-sefaz-background-light">
          {ticket.messageLog.map((msg, index) => {
            if (msg.sender === 'atendente') {
              return (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src={atendente.avatar} // Usa o avatar do atendente atual
                      alt="Avatar Atendente"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="ml-3 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-lg">
                    <p className="text-sm font-medium text-sefaz-blue-light">{msg.name || atendente.name}</p>
                    <p className="text-sm text-gray-700">{msg.text}</p>
                  </div>
                </div>
              );
            }
            if (msg.sender === 'bot') {
              return (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sefaz-blue flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-lg">
                    <p className="text-sm font-medium text-sefaz-blue">{msg.name}</p>
                    <p className="text-sm text-gray-700">{msg.text}</p>
                  </div>
                </div>
              );
            }
            if (msg.sender === 'rating') {
              return (
                <div key={index} className="py-2">
                  <div className="relative text-center">
                    <span className="px-2 bg-sefaz-background-light text-sm text-gray-500">
                      Atendimento Avaliado
                    </span>
                  </div>
                  <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm border mt-2">
                    <RatingStars count={msg.stars} />
                  </div>
                </div>
              );
            }
            // Mensagem do Usuário
            return (
              <div key={index} className="flex justify-end">
                <div className="mr-3 bg-green-100 p-3 rounded-lg rounded-tr-none shadow-sm max-w-lg">
                  <p className="text-sm text-gray-700">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Rodapé do Modal */}
        <footer className="p-3 bg-gray-50 border-t flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}