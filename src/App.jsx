import React, { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';

// Páginas do Sistema
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import GestaoIAPage from './pages/GestaoIAPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import BaseConhecimentoPage from './pages/BaseConhecimentoPage';
import TaxpayerConsolePage from './pages/TaxpayerConsolePage';

export default function App() {
  // --- ESTADOS GLOBAIS ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' ou 'agent'
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // Estado Global para o Modal de Boas-vindas (para não abrir toda hora ao navegar)
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState(false);

  // Estado para passar dados do Inbox PARA o Console Fiscal
  const [integratedTaxpayerData, setIntegratedTaxpayerData] = useState(null);

  // Estado para trazer dados do Console DE VOLTA para o Inbox (ex: histórico atualizado)
  const [consoleReturnData, setConsoleReturnData] = useState(null);

  // Estado Global do Timer SLA (para continuar contando mesmo mudando de tela)
  const [globalSlaTimer, setGlobalSlaTimer] = useState(0);

  // --- EFEITOS ---
  // Lógica do Timer SLA Global
  useEffect(() => {
    let interval = null;
    if (isLoggedIn) {
      interval = setInterval(() => {
        setGlobalSlaTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setGlobalSlaTimer(0); // Reseta se deslogar
    }
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // --- HANDLERS (Funções de Controle) ---

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setHasSeenWelcomeModal(false); // Reseta o modal ao logar novamente
    
    // Redirecionamento inicial baseado no perfil
    if (role === 'admin') {
      setActivePage('dashboard');
    } else {
      setActivePage('inbox');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActivePage('dashboard');
    setIntegratedTaxpayerData(null);
    setConsoleReturnData(null);
    setHasSeenWelcomeModal(false);
    setGlobalSlaTimer(0);
  };

  // Chamado pela InboxPage quando clica em "Abrir Console"
  const handleOpenTaxpayerConsole = (taxpayerData) => {
    setIntegratedTaxpayerData(taxpayerData);
    setActivePage('taxpayer-console');
  };

  // Chamado pelo Console quando clica em "Voltar"
  // Agora aceita dados de retorno (updatedData)
  const handleBackToInbox = (updatedData = null) => {
    if (updatedData) {
      setConsoleReturnData(updatedData);
    }
    setActivePage('inbox');
  };

  // Chamado pela InboxPage quando o usuário fecha o modal
  const handleCloseWelcomeModal = () => {
    setHasSeenWelcomeModal(true);
  };

  // --- RENDERIZAÇÃO ---

  // Se não estiver logado, mostra apenas a tela de login
  if (!isLoggedIn) {
    return (
      <div className="h-screen w-full flex">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-sefaz-background-light overflow-hidden min-h-0">
      
      {/* Menu Lateral */}
      <Sidebar 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activePage={activePage}
        setActivePage={setActivePage}
        userRole={userRole} 
      />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        
        {/* LÓGICA DE PERSISTÊNCIA DO CHAT:
          A InboxPage é renderizada sempre, mas escondida via CSS (display: none) quando não está ativa.
          Isso preserva o scroll, o texto digitado, o estado do chat e as bolinhas de "não lido".
        */}
        <div style={{ display: activePage === 'inbox' ? 'flex' : 'none', height: '100%', flexDirection: 'column', flex: 1 }}>
          <InboxPage 
            userRole={userRole} 
            onOpenConsole={handleOpenTaxpayerConsole}
            hasSeenWelcomeModal={hasSeenWelcomeModal}
            onCloseWelcomeModal={handleCloseWelcomeModal}
            currentSlaTime={globalSlaTimer} // Passa o timer global
            
            // Props para retorno de dados
            consoleReturnData={consoleReturnData}
            onClearConsoleReturn={() => setConsoleReturnData(null)}
          />
        </div>

        {/* As outras páginas são montadas/desmontadas normalmente quando ativas */}
        
        {activePage === 'dashboard' && <DashboardPage />}
        
        {activePage === 'taxpayer-console' && (
          <TaxpayerConsolePage 
            initialData={integratedTaxpayerData} 
            onBack={handleBackToInbox} 
            currentSlaTime={globalSlaTimer} // Passa o timer global para manter sincronia
          />
        )}
        
        {activePage === 'ia' && <GestaoIAPage />}
        
        {activePage === 'knowledge-base' && <BaseConhecimentoPage />}
        
        {activePage === 'reports' && <RelatoriosPage />}
        
        {activePage === 'settings' && <ConfiguracoesPage userRole={userRole} />}

      </main>
      
    </div>
  );
}