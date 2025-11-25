import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Bot, 
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  Landmark,
  Search // Ícone para a Consulta
} from 'lucide-react';

const NavItem = ({ icon: Icon, text, pageName, activePage, setActivePage, isCollapsed }) => (
  <li className="mb-2">
    <button
      onClick={() => setActivePage(pageName)} 
      title={isCollapsed ? text : ""}
      className={`
        flex items-center p-3 rounded-lg transition-colors w-full text-left
        ${activePage === pageName 
          ? 'bg-sefaz-blue-light/20 text-sefaz-blue-light font-medium' 
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <span className="flex-1 ml-3 whitespace-nowrap">{text}</span>
      )}
    </button>
  </li>
);

export default function Sidebar({ onLogout, isCollapsed, onToggleCollapse, activePage, setActivePage, userRole }) {
  
  const userName = userRole === 'admin' ? "Vinicius Dantas" : "Ana Silva";
  const userTitle = userRole === 'admin' ? "Supervisor Geral" : "Atendente Nível 2";

  return (
    <nav className={`
      hidden md:flex flex-col h-full bg-sefaz-blue text-white p-4 shadow-lg
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      
      {/* === HEADER DA SIDEBAR === */}
      <div className="flex items-center justify-center border-b border-white/20 pb-4 mb-4 h-[65px] overflow-hidden whitespace-nowrap">
        {isCollapsed ? (
          <div className="p-2 bg-white/10 rounded-lg">
            <Landmark className="w-6 h-6 text-white" />
          </div>
        ) : (
          <div className="flex flex-col justify-center">
             <div className="flex items-center text-2xl text-white leading-none">
               <span className="font-medium mr-1.5">Integra</span>
               <span className="font-extrabold">Sefaz</span>
             </div>
             <span className="text-xs font-medium opacity-70 mt-1 text-center">
               Atendimento
             </span>
          </div>
        )}
      </div>

      <ul className="flex-1">
        
        {/* Menus para Gestor/Admin */}
        {userRole === 'admin' && (
          <>
            <NavItem icon={LayoutDashboard} text="Painel de Gestão" pageName="dashboard" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            <NavItem icon={Inbox} text="Caixa de Entrada" pageName="inbox" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            {/* Admin também pode consultar */}
            <NavItem icon={Search} text="Consulta Contribuinte" pageName="taxpayer-console" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            <NavItem icon={Bot} text="Gestão da IA" pageName="ia" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
          </>
        )}

        {/* Menus para Atendente */}
        {userRole === 'agent' && (
          <>
            <NavItem icon={Inbox} text="Caixa de Entrada" pageName="inbox" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            {/* === NOVO MENU: Consulta Contribuinte === */}
            <NavItem icon={Search} text="Consulta Contribuinte" pageName="taxpayer-console" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            <NavItem icon={BookOpen} text="Base de Conhecimento" pageName="knowledge-base" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
          </>
        )}

        <NavItem icon={Settings} text="Configurações" pageName="settings" activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
      </ul>

      <div className={` flex p-2 ${isCollapsed ? 'justify-center' : 'justify-end'} `}>
        <button onClick={onToggleCollapse} title={isCollapsed ? "Expandir" : "Recolher"} className="p-2 text-gray-300 hover:text-white">
          {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>

      <div>
        <div className="border-t border-white/20 pt-4">
          <div className={` flex items-center p-3 ${isCollapsed ? 'justify-center' : ''} `}>
            <div className="relative flex-shrink-0" title="Online">
              <img 
                src={`https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=007bff&color=fff`} 
                alt="Avatar do Atendente" 
                className="w-10 h-10 rounded-full border-2 border-sefaz-blue-light" 
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-sefaz-blue rounded-full"></span>
            </div>
            
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white whitespace-nowrap">{userName}</p>
                <p className="text-xs text-gray-300 whitespace-nowrap">{userTitle}</p>
              </div>
            )}
          </div>
        </div>

        <div className={` flex items-center mt-2 p-3 ${isCollapsed ? 'justify-center' : ''} `}>
          <button onClick={onLogout} title="Deslogar" className="flex items-center text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2 text-sm">Deslogar</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}