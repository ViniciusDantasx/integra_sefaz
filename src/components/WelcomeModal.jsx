import React from 'react';
import { Info, BarChart3, CheckCircle } from 'lucide-react';

export default function WelcomeModal({ queueCount, onClose, userName, role = 'agent' }) {
  const firstName = userName ? userName.split(' ')[0] : 'Usuário';
  const isAdmin = role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Ícone Diferenciado por Perfil */}
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isAdmin ? 'bg-blue-100' : 'bg-sefaz-background'}`}>
          {isAdmin ? (
            <BarChart3 className="h-8 w-8 text-blue-800" />
          ) : (
            <Info className="h-8 w-8 text-sefaz-blue" />
          )}
        </div>
        
        {/* Título */}
        <h2 className={`mt-6 text-center text-2xl font-bold ${isAdmin ? 'text-gray-800' : 'text-sefaz-blue'}`}>
          {isAdmin ? `Painel de Gestão | Sefaz` : `Bem-vindo(a), ${firstName}!`}
        </h2>
        
        {/* Corpo da Mensagem Diferenciado */}
        <div className="mt-4 text-center text-gray-600">
          {isAdmin ? (
            // Mensagem para o GESTOR
            <>
              <p className="mb-2">Olá, <strong>{firstName}</strong>. O sistema está operante.</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-left inline-block w-full">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Equipe: <strong>5 Atendentes Online</strong></span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Status IA: <strong>Operacional</strong></span>
                </div>
              </div>
            </>
          ) : (
            // Mensagem para o ATENDENTE
            <p className="text-lg">
              Você possui <strong className="font-bold text-sefaz-blue">{queueCount}</strong> atendimentos
              na fila aguardando sua ação.
            </p>
          )}
        </div>
        
        {/* Botão de Ação */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className={`w-full rounded-lg p-3 text-lg font-semibold text-white shadow transition-colors ${
              isAdmin 
                ? 'bg-gray-800 hover:bg-gray-900' 
                : 'bg-sefaz-blue hover:bg-sefaz-blue-dark'
            }`}
          >
            {isAdmin ? 'Acessar Dashboard' : 'Iniciar Atendimento'}
          </button>
        </div>
        
      </div>
    </div>
  );
}