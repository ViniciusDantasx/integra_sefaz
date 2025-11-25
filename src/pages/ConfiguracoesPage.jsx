import React, { useState, useEffect } from 'react';
import { 
  User, Shield, FileText, Database, Save, Search, Plus, MoreVertical, 
  CheckCircle, XCircle, RefreshCw, Lock, MessageSquare, Bot, Edit2, 
  Trash2, Ban, Check, X, Loader2, AlertTriangle
} from 'lucide-react';

// ==================================================================================
// 1. DADOS MOCKADOS
// ==================================================================================

const initialUsers = [
  { id: 1, nome: 'Vinicius Dantas', email: 'vinicius@sefaz.pe.gov.br', perfil: 'Supervisor', status: 'Ativo', ultimoAcesso: 'Hoje, 08:00' },
  { id: 2, nome: 'Ana Silva', email: 'ana.silva@sefaz.pe.gov.br', perfil: 'Atendente Nível 2', status: 'Ativo', ultimoAcesso: 'Hoje, 08:15' },
  { id: 3, nome: 'Roberto Santos', email: 'roberto@sefaz.pe.gov.br', perfil: 'Supervisor', status: 'Ativo', ultimoAcesso: 'Ontem, 18:00' },
  { id: 4, nome: 'João Inativo', email: 'joao@sefaz.pe.gov.br', perfil: 'Atendente Nível 1', status: 'Inativo', ultimoAcesso: '20/10/2025' },
];

const mockAuditLogs = [
  { id: 101, usuario: 'Vinicius Dantas', acao: 'Alterou resposta da IA', detalhe: 'Tópico: IPVA 2025', data: 'Hoje, 10:45', ip: '192.168.1.10' },
  { id: 102, usuario: 'Vinicius Dantas', acao: 'Login no Sistema', detalhe: 'Sucesso', data: 'Hoje, 08:00', ip: '192.168.1.10' },
  { id: 103, usuario: 'Ana Silva', acao: 'Encerrou Atendimento', detalhe: 'Protocolo #TKT-1023', data: 'Hoje, 09:30', ip: '192.168.1.15' },
  { id: 104, usuario: 'Sistema', acao: 'Backup Automático', detalhe: 'Banco de Dados', data: 'Hoje, 03:00', ip: 'localhost' },
  { id: 105, usuario: 'Roberto Santos', acao: 'Criou Usuário', detalhe: 'Novo atendente: Mariana', data: 'Ontem, 14:00', ip: '192.168.1.20' },
];

// Componente de Aba Seguro
const SettingsTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all mb-1
      ${isActive ? 'bg-sefaz-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
    `}
  >
    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
    {label}
  </button>
);

// ==================================================================================
// 2. PÁGINA PRINCIPAL
// ==================================================================================

export default function ConfiguracoesPage({ userRole = 'agent' }) {
  const isAdmin = userRole === 'admin';
  const [activeTab, setActiveTab] = useState('profile');
  
  // Estados de Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Estados do Perfil
  const [myUserName, setMyUserName] = useState(isAdmin ? 'Vinicius Dantas' : 'Ana Silva');
  const [myUserEmail, setMyUserEmail] = useState(isAdmin ? 'vinicius@sefaz.pe.gov.br' : 'ana.silva@sefaz.pe.gov.br');
  const [myUserTitle, setMyUserTitle] = useState(isAdmin ? 'Supervisor' : 'Atendente Nível 2');

  // Estados de Sistema (Simulação Real)
  // Chaves: db, ia, whats, rfb
  const [systemStatus, setSystemStatus] = useState({ db: 'online', ia: 'processing', whats: 'online', rfb: 'error' });

  // Estados para Exclusão de Usuário
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      setMyUserName('Vinicius Dantas');
      setMyUserEmail('vinicius@sefaz.pe.gov.br');
      setMyUserTitle('Supervisor');
    } else {
      setMyUserName('Ana Silva');
      setMyUserEmail('ana.silva@sefaz.pe.gov.br');
      setMyUserTitle('Atendente Nível 2');
    }
  }, [isAdmin]);

  // === ESTADOS PARA GESTÃO DE USUÁRIOS ===
  const [users, setUsers] = useState(initialUsers);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeActionMenu, setActiveActionMenu] = useState(null); 

  // === HELPERS ===
  const handleShowToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // === FUNÇÕES DE AÇÃO ===

  const handleSaveProfile = () => {
    setIsLoadingAction(true);
    setTimeout(() => {
      setIsLoadingAction(false);
      handleShowToast("Perfil atualizado com sucesso!");
    }, 1000);
  };

  // Ação Inteligente de Sistema
  const handleSystemAction = (serviceLabel, action) => {
    handleShowToast(`Executando: ${action} em ${serviceLabel}...`, 'info');
    
    const serviceKeyMap = {
      'Base de Dados': 'db',
      'WhatsApp': 'whats',
      'IA Engine': 'ia',
      'RFB': 'rfb'
    };

    const key = serviceKeyMap[serviceLabel];

    // Simula tempo de processamento da API
    setTimeout(() => {
      if (action === 'Renovar Certificado' && key === 'rfb') {
        setSystemStatus(prev => ({ ...prev, rfb: 'online' })); // Corrige o erro
        handleShowToast('Certificado digital renovado. Status: Online.', 'success');
      } else if (action === 'Limpar Cache' && key === 'ia') {
        setSystemStatus(prev => ({ ...prev, ia: 'online' })); // Normaliza o status
        handleShowToast('Cache limpo. IA operando em latência normal.', 'success');
      } else if (action === 'Reiniciar' && key) {
        // Simula blink de offline -> online
        setSystemStatus(prev => ({ ...prev, [key]: 'offline' }));
        setTimeout(() => {
           setSystemStatus(prev => ({ ...prev, [key]: 'online' }));
           handleShowToast(`${serviceLabel} reiniciado com sucesso!`, 'success');
        }, 1000);
      } else {
        handleShowToast(`Diagnóstico de ${serviceLabel}: Operação Normal.`, 'success');
      }
    }, 2000);
  };
  
  const handleOpenUserModal = (user = null) => {
    setCurrentUser(user);
    setIsUserModalOpen(true);
    setActiveActionMenu(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      perfil: formData.get('perfil'),
      status: 'Ativo',
      ultimoAcesso: 'Nunca',
    };

    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...newUser, status: u.status, ultimoAcesso: u.ultimoAcesso } : u));
      handleShowToast("Usuário atualizado com sucesso.");
    } else {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      handleShowToast("Novo usuário criado com sucesso.");
    }
    setIsUserModalOpen(false);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Ativo' ? 'Inativo' : 'Ativo';
        handleShowToast(`Usuário ${u.nome} agora está ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    setActiveActionMenu(null);
  };

  // Abre o modal de confirmação
  const handleRequestDelete = (user) => {
    setUserToDelete(user);
    setActiveActionMenu(null);
  };

  // Efetiva a exclusão
  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      handleShowToast(`Usuário ${userToDelete.nome} excluído permanentemente.`, 'success');
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-xl animate-in slide-in-from-top-5 flex items-center gap-3 text-white font-medium ${toastMessage.type === 'error' ? 'bg-red-600' : toastMessage.type === 'info' ? 'bg-blue-600' : 'bg-green-600'}`}>
          {toastMessage.type === 'error' ? <XCircle size={20}/> : toastMessage.type === 'info' ? <Loader2 size={20} className="animate-spin"/> : <CheckCircle size={20}/>} 
          {toastMessage.text}
        </div>
      )}

      {/* MODAL DE EXCLUSÃO (CONFIRMAÇÃO) */}
      {userToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Usuário?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Você está prestes a remover <strong>{userToDelete.nome}</strong>. Essa ação é irreversível e removerá o acesso imediato ao sistema.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setUserToDelete(null)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteUser} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-sm text-gray-500">
          {isAdmin ? "Gerencie seu perfil, equipe e segurança do sistema." : "Gerencie seus dados pessoais e preferências de conta."}
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Conta</h3>
            <SettingsTab icon={User} label="Meu Perfil" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            
            {isAdmin && (
              <>
                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Administração</h3>
                <SettingsTab icon={Shield} label="Usuários e Permissões" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <SettingsTab icon={FileText} label="Logs de Auditoria" isActive={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
                
                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Sistema</h3>
                <SettingsTab icon={Database} label="Status e Integrações" isActive={activeTab === 'system'} onClick={() => setActiveTab('system')} />
              </>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          
          {/* ABA: MEU PERFIL */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl animate-in fade-in duration-300 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
              </div>
              
              {/* Dados Pessoais */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                      <img src={`https://ui-avatars.com/api/?name=${myUserName.replace(' ', '+')}&background=007bff&color=fff&size=128`} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="text-white w-6 h-6"/>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold text-xl text-gray-800">{myUserName}</h3>
                    <p className="text-sm text-sefaz-blue font-medium bg-blue-50 px-2 py-0.5 rounded w-fit mt-1">{myUserTitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                    <input type="text" value={myUserName} onChange={(e) => setMyUserName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">E-mail Corporativo</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 pointer-events-none"><Bot className="text-gray-400 w-5 h-5"/></div>
                      <input type="email" value={myUserEmail} onChange={(e) => setMyUserEmail(e.target.value)} className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-500 cursor-not-allowed" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* Segurança */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-400" />
                    Alterar Senha
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Atual</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sefaz-blue transition-shadow" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Senha</label>
                      <input type="password" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sefaz-blue transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar Senha</label>
                      <input type="password" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sefaz-blue transition-shadow" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveProfile} disabled={isLoadingAction} className="flex items-center px-8 py-3 bg-sefaz-blue text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all font-bold disabled:opacity-70">
                  {isLoadingAction ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2"/>} 
                  {isLoadingAction ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}

          {/* ABA: USUÁRIOS */}
          {isAdmin && activeTab === 'users' && (
            <div className="max-w-6xl animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Gerenciar Equipe</h2>
                  <p className="text-sm text-gray-500">Adicione, edite ou remova acessos ao sistema.</p>
                </div>
                <button 
                  onClick={() => handleOpenUserModal()}
                  className="flex items-center px-4 py-2 bg-sefaz-blue text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Usuário
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input type="text" placeholder="Buscar por nome ou email..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-shadow" />
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="flex gap-2">
                     <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 text-sm font-medium hover:bg-gray-50">Filtrar</button>
                  </div>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b font-semibold">
                    <tr>
                      <th className="px-6 py-4">Usuário</th>
                      <th className="px-6 py-4">Perfil</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Último Acesso</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3 border border-blue-200">
                              {user.nome.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.nome}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                            {user.perfil}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'Ativo' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{user.ultimoAcesso}</td>
                        <td className="px-6 py-4 text-right relative">
                          <button 
                            onClick={() => setActiveActionMenu(activeActionMenu === user.id ? null : user.id)}
                            className={`p-2 rounded-lg transition-colors ${activeActionMenu === user.id ? 'bg-blue-50 text-sefaz-blue' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {activeActionMenu === user.id && (
                            <div className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                              <button onClick={() => handleOpenUserModal(user)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                                <Edit2 className="w-4 h-4 mr-3 text-gray-400" /> Editar Dados
                              </button>
                              <button onClick={() => handleToggleStatus(user.id)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                                {user.status === 'Ativo' ? <><Ban className="w-4 h-4 mr-3 text-orange-500" /> Desativar Acesso</> : <><CheckCircle className="w-4 h-4 mr-3 text-green-500" /> Ativar Acesso</>}
                              </button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button onClick={() => handleRequestDelete(user)} className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
                                <Trash2 className="w-4 h-4 mr-3" /> Excluir Usuário
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA: AUDITORIA */}
          {isAdmin && activeTab === 'audit' && (
            <div className="max-w-6xl animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Logs de Auditoria do Sistema</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b font-semibold">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Usuário</th>
                      <th className="px-6 py-4">Ação</th>
                      <th className="px-6 py-4">Detalhe da Operação</th>
                      <th className="px-6 py-4">Origem (IP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.data}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{log.usuario}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-medium shadow-sm">{log.acao}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{log.detalhe}</td>
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA: SISTEMA (COM FEEDBACK) */}
          {isAdmin && activeTab === 'system' && (
            <div className="max-w-4xl animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Saúde e Integrações do Sistema</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Database Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${systemStatus.db === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Database className={`w-6 h-6 ${systemStatus.db === 'online' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Base de Dados SEFAZ</h3>
                      <p className="text-sm text-gray-500">PostgreSQL Enterprise • Latência: 12ms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className={`flex items-center font-bold text-sm ${systemStatus.db === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      {systemStatus.db === 'online' ? <><CheckCircle className="w-4 h-4 mr-1"/> Online</> : <><XCircle className="w-4 h-4 mr-1"/> Offline</>}
                    </div>
                    <button onClick={() => handleSystemAction('Base de Dados', 'Testar Conexão')} className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors">Testar Conexão</button>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4"><MessageSquare className="w-6 h-6 text-green-600" /></div>
                    <div>
                      <h3 className="font-bold text-gray-800">API WhatsApp Business</h3>
                      <p className="text-sm text-gray-500">Meta Graph API v18.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className={`flex items-center font-bold text-sm ${systemStatus.whats === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Online
                    </div>
                    <button onClick={() => handleSystemAction('WhatsApp', 'Reiniciar')} className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors flex items-center"><RefreshCw size={12} className="mr-1"/> Reiniciar Serviço</button>
                  </div>
                </div>

                {/* IA Engine Card (COM REPARO) */}
                <div className={`bg-white p-5 rounded-xl shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${systemStatus.ia === 'online' ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'}`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${systemStatus.ia === 'online' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <Bot className={`w-6 h-6 ${systemStatus.ia === 'online' ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Motor de IA (NLP)</h3>
                      <p className="text-sm text-gray-500">{systemStatus.ia === 'online' ? 'Operação Normal' : 'Processamento em fila (High Load)'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {systemStatus.ia === 'online' ? (
                       <div className="flex items-center text-green-600 font-bold text-sm"><CheckCircle className="w-4 h-4 mr-1" /> Online</div>
                    ) : (
                       <div className="flex items-center text-yellow-600 font-bold text-sm"><RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Processando</div>
                    )}
                    <button onClick={() => handleSystemAction('IA Engine', 'Limpar Cache')} className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors">Limpar Cache</button>
                  </div>
                </div>

                {/* RFB Integration Card (COM REPARO REAL) */}
                <div className={`bg-white p-5 rounded-xl shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-500 ${systemStatus.rfb === 'error' ? 'border-red-200 ring-2 ring-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${systemStatus.rfb === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <Lock className={`w-6 h-6 ${systemStatus.rfb === 'error' ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Integração Receita Federal</h3>
                      <p className={`text-sm font-medium ${systemStatus.rfb === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
                        {systemStatus.rfb === 'error' ? 'Falha na autenticação do certificado.' : 'Conexão segura e autenticada.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className={`flex items-center font-bold text-sm ${systemStatus.rfb === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                       {systemStatus.rfb === 'error' ? <><XCircle className="w-4 h-4 mr-1" /> Erro Crítico</> : <><CheckCircle className="w-4 h-4 mr-1" /> Online</>}
                    </div>
                    {systemStatus.rfb === 'error' && (
                      <button onClick={() => handleSystemAction('RFB', 'Renovar Certificado')} className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors shadow-sm">Renovar Certificado</button>
                    )}
                    {systemStatus.rfb === 'online' && (
                       <button onClick={() => handleSystemAction('RFB', 'Testar Conexão')} className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors">Testar Conexão</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL DE ADICIONAR/EDITAR USUÁRIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">{currentUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                <input name="nome" required type="text" defaultValue={currentUser?.nome} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-shadow" placeholder="Ex: Maria Souza" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">E-mail Institucional</label>
                <input name="email" required type="email" defaultValue={currentUser?.email} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-shadow" placeholder="nome@sefaz.pe.gov.br" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Perfil de Acesso</label>
                <select name="perfil" defaultValue={currentUser?.perfil || 'Atendente Nível 2'} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue bg-white">
                  <option>Atendente Nível 2</option>
                  <option>Supervisor</option>
                  <option>Administrador</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t mt-2">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sefaz-blue text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm transition-colors">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}