import React, { useState, useEffect } from 'react';
import HistoryModal from '../components/HistoryModal';
import WelcomeModal from '../components/WelcomeModal';
import { 
  Users, Clock, Smile, CheckCircle, Download, FileText, Filter, Eye, 
  TrendingUp, AlertTriangle, Phone, MessageSquare, MoreHorizontal, 
  Activity, Zap, MonitorPlay, Calendar, X, Send, Check, Loader2, Lock,
  AlertOctagon, ArrowRight, ArrowLeft, Info, Power, Coffee, ThumbsUp
} from 'lucide-react';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

// ==================================================================================
// 1. DADOS MOCKADOS & UTILITÁRIOS
// ==================================================================================

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const teamMembersMock = [
  { id: 1, name: 'Vinicius Dantas', role: 'Supervisor', status: 'online', currentTask: 'Monitorando Fila', avatar: 'https://ui-avatars.com/api/?name=Vinicius+Dantas&background=007bff&color=fff', queues: ['Sup', 'N3'] },
  { id: 2, name: 'Ana Silva', role: 'Nível 2', status: 'busy', currentTask: 'Em atendimento (Telefone)', avatar: 'https://ui-avatars.com/api/?name=Ana+Silva&background=random&color=fff', queues: ['Voz', 'Chat'] },
  { id: 3, name: 'Carlos Oliveira', role: 'Nível 2', status: 'online', currentTask: 'Aguardando chamado', avatar: 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=random&color=fff', queues: ['Chat', 'Email'] },
  { id: 4, name: 'Mariana Costa', role: 'Nível 2', status: 'break', currentTask: 'Pausa Almoço (Volta 13:00)', avatar: 'https://ui-avatars.com/api/?name=Mariana+Costa&background=random&color=fff', queues: ['Voz'] },
  { id: 5, name: 'Roberto Santos', role: 'Nível 1', status: 'busy', currentTask: 'Em atendimento (Chat)', avatar: 'https://ui-avatars.com/api/?name=Roberto+Santos&background=random&color=fff', queues: ['Chat'] },
];

// Mock Inicial de Alertas Críticos (NOME CORRIGIDO)
const initialCriticalAlerts = [
  { 
    id: 101, 
    tipo: 'SLA', 
    texto: 'Fila de WhatsApp excedeu 10min', 
    tempo: 'Há 2 min', 
    severidade: 'alta', 
    details: '5 clientes aguardando triagem inicial na fila "Dúvidas Gerais".',
    causa: 'Pico inesperado de demanda.',
    acaoRecomendada: 'Alocar 2 atendentes de Nível 1 para triagem.'
  },
  { 
    id: 102, 
    tipo: 'Avaliação', 
    texto: 'Avaliação negativa (1 estrela) recebida', 
    tempo: 'Há 5 min', 
    severidade: 'media', 
    details: 'Protocolo TKT-202599: Cliente reclamou de demora e falta de clareza.',
    causa: 'Insatisfação com tempo de espera.',
    acaoRecomendada: 'Auditar conversa e entrar em contato ativo.'
  },
  { 
    id: 103, 
    tipo: 'Sistema', 
    texto: 'Lentidão detectada no módulo DAE', 
    tempo: 'Há 15 min', 
    severidade: 'baixa', 
    details: 'Tempo de resposta da API de emissão > 5s.',
    causa: 'Instabilidade no servidor da SEFAZ.',
    acaoRecomendada: 'Abrir chamado técnico Nível 3.'
  },
];

const generateMockHistory = (rating, agentName, subject) => {
  return [
    { sender: 'bot', name: 'Assistente Virtual', text: `Olá. Dúvida sobre ${subject}?` },
    { sender: 'user', text: 'Sim, preciso de ajuda urgente.' },
    { sender: 'atendente', name: agentName, text: 'Olá, em que posso ajudar?' },
    { sender: 'user', text: 'Resolvido, obrigado.' },
    { sender: 'rating', stars: rating }
  ];
};

const fetchDashboardData = () => {
  const total = Math.floor(getRandomInt(1000, 2000));
  const tableData = Array(20).fill(0).map((_, i) => {
    const agent = teamMembersMock[getRandomInt(0, teamMembersMock.length - 1)];
    const avaliacao = getRandomInt(3, 5); 
    const assunto = ['Dúvida IPVA', 'Emissão DAE', 'Erro Sistema', 'Cadastro', 'Nota Fiscal'][getRandomInt(0, 4)];
    return {
      id: `TKT-${202500 + i}`,
      data: new Date(Date.now() - i * 1800 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      canal: ['WhatsApp', 'Telegram', 'Web', 'Telefone'][getRandomInt(0, 3)],
      assunto: assunto,
      status: 'Resolvido',
      avaliacao: avaliacao,
      atendente: agent,
      messageLog: generateMockHistory(avaliacao, agent.name, assunto)
    };
  });

  return {
    kpis: {
      totalAtendimentos: total.toLocaleString('pt-BR'),
      tma: `0${getRandomInt(3,6)}:${getRandomInt(10,59)}`,
      filaEspera: getRandomInt(5, 25),
      satisfacao: (getRandomInt(40, 50) / 10).toFixed(1),
    },
    volumeData: {
      labels: ['08h', '09h', '10h', '11h', '12h', '13h', '14h'],
      datasets: [
        { label: 'Hoje', data: Array(7).fill(0).map(() => getRandomInt(20, 100)), borderColor: '#004a91', backgroundColor: 'rgba(0, 74, 145, 0.1)', tension: 0.4, fill: true },
        { label: 'Ontem', data: Array(7).fill(0).map(() => getRandomInt(20, 100)), borderColor: '#9ca3af', borderDash: [5, 5], tension: 0.4, fill: false }
      ]
    },
    canalData: {
      labels: ['WhatsApp', 'Telefone', 'Web', 'Telegram'],
      datasets: [{ data: [getRandomInt(40,60), getRandomInt(20,30), getRandomInt(10,20), getRandomInt(5,10)], backgroundColor: ['#22c55e', '#3b82f6', '#64748b', '#0ea5e9'], borderWidth: 0 }]
    },
    reportTable: tableData
  };
};

const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { borderDash: [2, 4] } } } };
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } } }, cutout: '75%' };

// ==================================================================================
// 2. COMPONENTES DE MODAIS
// ==================================================================================

const ManageScheduleModal = ({ members, onClose, onSave }) => {
  const [localMembers, setLocalMembers] = useState(JSON.parse(JSON.stringify(members)));
  const [saving, setSaving] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    setLocalMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const toggleQueue = (id, queue) => {
    setLocalMembers(prev => prev.map(m => {
      if (m.id === id) {
        const queues = m.queues.includes(queue) 
          ? m.queues.filter(q => q !== queue)
          : [...m.queues, queue];
        return { ...m, queues };
      }
      return m;
    }));
  };

  const handleConfirm = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(localMembers);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Users size={20}/> Gerenciar Escala e Filas</h3>
          <button onClick={onClose} className="hover:text-gray-300"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {localMembers.map(member => (
              <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <img src={member.avatar} className="w-10 h-10 rounded-full border" alt={member.name}/>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex gap-1">
                    <button onClick={() => handleStatusChange(member.id, 'online')} className={`p-2 rounded-lg transition-colors ${member.status === 'online' ? 'bg-green-100 text-green-700 ring-1 ring-green-500' : 'hover:bg-gray-100 text-gray-400'}`} title="Online"><Zap size={16} fill={member.status === 'online' ? "currentColor" : "none"}/></button>
                    <button onClick={() => handleStatusChange(member.id, 'break')} className={`p-2 rounded-lg transition-colors ${member.status === 'break' ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-500' : 'hover:bg-gray-100 text-gray-400'}`} title="Pausa"><Coffee size={16} /></button>
                    <button onClick={() => handleStatusChange(member.id, 'offline')} className={`p-2 rounded-lg transition-colors ${member.status === 'offline' ? 'bg-gray-200 text-gray-700 ring-1 ring-gray-500' : 'hover:bg-gray-100 text-gray-400'}`} title="Offline"><Power size={16} /></button>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[150px]">
                    {['Chat', 'Voz', 'Email'].map(q => (
                      <button key={q} onClick={() => toggleQueue(member.id, q)} className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${member.queues.includes(q) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Cancelar</button>
          <button onClick={handleConfirm} disabled={saving} className="px-4 py-2 bg-sefaz-blue text-white rounded hover:bg-blue-700 text-sm font-bold flex items-center gap-2">{saving ? <Loader2 className="animate-spin" size={16}/> : <Check size={16}/>} Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

const IncidentsModal = ({ incidentsList, onClose, onResolve }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleResolveClick = (id) => {
    onResolve(id);
    if (selectedIncident?.id === id) setSelectedIncident(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[500px]">
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><AlertOctagon size={20}/> {selectedIncident ? 'Detalhes do Incidente' : 'Painel de Incidentes Operacionais'}</h3>
          <button onClick={onClose} className="hover:text-red-200"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {selectedIncident ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setSelectedIncident(null)} className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4">
                <ArrowLeft size={16} className="mr-1"/> Voltar para lista
              </button>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-bold text-gray-800">{selectedIncident.texto}</h2><span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded">{selectedIncident.tipo}</span></div>
                <div className="grid grid-cols-2 gap-4 mb-4"><div className="p-3 bg-gray-50 rounded border border-gray-100"><p className="text-xs text-gray-500 uppercase font-bold">Tempo Decorrido</p><p className="text-sm font-medium">{selectedIncident.tempo}</p></div><div className="p-3 bg-gray-50 rounded border border-gray-100"><p className="text-xs text-gray-500 uppercase font-bold">Severidade</p><p className="text-sm font-medium capitalize text-red-600">{selectedIncident.severidade}</p></div></div>
                <div className="space-y-4"><div><h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Info size={16}/> Descrição Detalhada</h4><p className="text-sm text-gray-600 mt-1">{selectedIncident.details}</p></div><div><h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Activity size={16}/> Causa Raiz Provável</h4><p className="text-sm text-gray-600 mt-1">{selectedIncident.causa}</p></div><div className="bg-blue-50 p-3 rounded border border-blue-100"><h4 className="text-sm font-bold text-blue-800 flex items-center gap-2"><Zap size={16}/> Ação Recomendada</h4><p className="text-sm text-blue-700 mt-1">{selectedIncident.acaoRecomendada}</p></div></div>
              </div>
              <div className="flex justify-end gap-3"><button onClick={() => handleResolveClick(selectedIncident.id)} className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><CheckCircle size={18}/> Marcar como Resolvido</button></div>
            </div>
          ) : (
            <>
              {incidentsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400"><CheckCircle size={48} className="mb-4 text-green-500"/><p>Todos os incidentes foram resolvidos.</p></div>
              ) : (
                <div className="space-y-4">
                  {incidentsList.map(incident => (
                    <div key={incident.id} className="bg-white border-l-4 border-red-500 rounded-r-lg shadow-sm p-4 flex justify-between items-start hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-1"><span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold uppercase rounded">{incident.tipo}</span><span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {incident.tempo}</span></div>
                        <h4 className="font-bold text-gray-800">{incident.texto}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{incident.details}</p>
                      </div>
                      <div className="flex gap-2"><button onClick={() => setSelectedIncident(incident)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Detalhes</button><button onClick={() => handleResolveClick(incident.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1"><Check size={12}/> Resolver</button></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MonitorModal = ({ agent, onClose }) => {
  return ( <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"> <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]"> <div className="bg-gray-900 text-white p-4 flex justify-between items-center"> <div className="flex items-center gap-3"> <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span> <span className="font-mono text-sm">AO VIVO: {agent.name} - {agent.currentTask}</span> </div> <button onClick={onClose} className="hover:text-red-400"><X size={20}/></button> </div> <div className="flex-1 bg-gray-200 flex items-center justify-center relative"> <div className="w-[90%] h-[80%] bg-white shadow-lg rounded border border-gray-300 flex flex-col"> <div className="h-8 bg-gray-100 border-b flex items-center px-2 gap-1"> <div className="w-2 h-2 rounded-full bg-red-400"></div><div className="w-2 h-2 rounded-full bg-yellow-400"></div><div className="w-2 h-2 rounded-full bg-green-400"></div> </div> <div className="flex-1 p-4 font-mono text-xs text-gray-400"> <p>[SYSTEM] Conectado ao CRM...</p> <p>[AGENT] Consultando base de dados CPF 123...</p> <p>[SYSTEM] Retorno: Status Irregular (IPVA 2024)</p> <div className="mt-4 p-2 bg-blue-50 border border-blue-100 text-blue-800">Chat Ativo com Contribuinte...</div> </div> </div> <div className="absolute bottom-4 bg-black/50 text-white px-4 py-1 rounded-full text-xs">Visualizando em tempo real (Latência: 24ms)</div> </div> <div className="p-4 bg-white border-t flex justify-end gap-3"> <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Fechar Monitoramento</button> <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-bold flex items-center gap-2"><Lock size={14}/> Intervir / Assumir</button> </div> </div> </div> );
};

const MessageAgentModal = ({ agent, onClose, onSend }) => {
  const [msg, setMsg] = useState('');
  const handleSend = () => { if(!msg.trim()) return; onSend(agent.name, msg); onClose(); };
  return ( <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"> <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"> <div className="bg-sefaz-blue text-white p-4 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><MessageSquare size={18}/> Mensagem para {agent.name}</h3><button onClick={onClose}><X size={20}/></button></div> <div className="p-6"> <p className="text-sm text-gray-500 mb-2">Esta mensagem aparecerá como um "pop-up" urgente na tela do atendente.</p> <textarea autoFocus className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue resize-none h-32" placeholder="Ex: Atenção ao tempo de SLA..." value={msg} onChange={e=>setMsg(e.target.value)}></textarea> <div className="flex justify-end gap-2 mt-4"><button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancelar</button><button onClick={handleSend} className="px-4 py-2 bg-sefaz-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Send size={16}/> Enviar</button></div> </div> </div> </div> );
};

// ==================================================================================
// 3. COMPONENTES VISUAIS
// ==================================================================================

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-all group cursor-default">
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 group-hover:text-sefaz-blue transition-colors">{value}</h3>
      <div className={`flex items-center mt-2 text-xs font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
        {trend === 'up' ? <TrendingUp size={14} className="mr-1"/> : trend === 'down' ? <AlertTriangle size={14} className="mr-1"/> : null}
        {subtext}
      </div>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-').replace('bg-opacity-10', '')} />
    </div>
  </div>
);

const AgentCard = ({ agent, onMonitor, onMessage }) => (
  <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="relative">
        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${agent.status === 'online' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{agent.name}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          {agent.status === 'online' ? <span className="text-green-600">Disponível</span> : agent.status === 'busy' ? <span className="text-red-600">Em Atendimento</span> : <span className="text-yellow-600">Pausa</span>}
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          {agent.role}
        </p>
      </div>
    </div>
    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      <button onClick={() => onMonitor(agent)} title="Monitorar Tela" className="p-2 text-gray-400 hover:text-sefaz-blue hover:bg-blue-50 rounded-lg transition-colors"><MonitorPlay size={16}/></button>
      <button onClick={() => onMessage(agent)} title="Enviar Mensagem" className="p-2 text-gray-400 hover:text-sefaz-blue hover:bg-blue-50 rounded-lg transition-colors"><MessageSquare size={16}/></button>
    </div>
  </div>
);

// ==================================================================================
// 4. PÁGINA PRINCIPAL (CONTROLLER)
// ==================================================================================

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Estado GLOBAL da Equipe e Incidentes
  const [teamState, setTeamState] = useState(teamMembersMock);
  const [activeAlerts, setActiveAlerts] = useState(initialCriticalAlerts);

  // Modais e Feedback
  const [viewingTicket, setViewingTicket] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [monitorAgent, setMonitorAgent] = useState(null);
  const [messageAgent, setMessageAgent] = useState(null);
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false); 
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setIsLoadingData(true);
    const timer = setTimeout(() => {
      const data = fetchDashboardData(); 
      setDashboardData(data);
      setIsLoadingData(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [startDate, endDate]); 

  const handleShowToast = (msg) => { setToastMessage(msg); setTimeout(()=>setToastMessage(null), 3000); };
  const handleExport = () => { handleShowToast("Gerando relatório PDF... Aguarde o download."); setTimeout(() => handleShowToast("Download concluído!"), 2000); };
  const handleSendMessageToAgent = (agentName, message) => { handleShowToast(`Mensagem enviada para ${agentName}: "${message.substring(0, 20)}..."`); };
  const handleAccessSupport = () => { handleShowToast("Redirecionando para suporte técnico..."); };

  const handleUpdateSchedule = (updatedMembers) => {
    setTeamState(updatedMembers);
    handleShowToast("Escala e filas atualizadas com sucesso.");
  };

  const handleResolveAlert = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
    handleShowToast("Incidente marcado como resolvido.");
  };

  const filteredTableData = dashboardData 
    ? (selectedAgent === 'all' 
        ? dashboardData.reportTable 
        : dashboardData.reportTable.filter(t => t.atendente.name === selectedAgent))
    : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50 font-sans relative">
      
      {/* Modais */}
      {showWelcomeModal && <WelcomeModal userName="Vinicius Dantas" role="admin" onClose={() => setShowWelcomeModal(false)} />}
      {viewingTicket && <HistoryModal ticket={viewingTicket} atendente={viewingTicket.atendente} onClose={() => setViewingTicket(null)} />}
      {monitorAgent && <MonitorModal agent={monitorAgent} onClose={() => setMonitorAgent(null)} />}
      {messageAgent && <MessageAgentModal agent={messageAgent} onClose={() => setMessageAgent(null)} onSend={handleSendMessageToAgent} />}
      
      {showIncidentsModal && (
        <IncidentsModal 
          incidentsList={activeAlerts} 
          onClose={() => setShowIncidentsModal(false)} 
          onResolve={handleResolveAlert} 
        />
      )}
      
      {showScheduleModal && <ManageScheduleModal members={teamState} onClose={() => setShowScheduleModal(false)} onSave={handleUpdateSchedule} />}
      
      {/* Toast Global */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[100] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-in slide-in-from-top-5 flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20}/> {toastMessage}
        </div>
      )}

      {/* Header Operacional */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-sefaz-blue"/> Cockpit de Gestão
            </h1>
            <p className="text-sm text-gray-500">Monitoramento em tempo real da operação de atendimento.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
            <div className="flex items-center gap-2 px-2"><span className="text-xs text-gray-500 font-bold">DE:</span><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="bg-transparent border-none text-sm p-0 text-gray-700 focus:ring-0 w-24"/></div>
            <div className="flex items-center gap-2 px-2"><span className="text-xs text-gray-500 font-bold">ATÉ:</span><input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="bg-transparent border-none text-sm p-0 text-gray-700 focus:ring-0 w-24"/></div>
            <div className="h-4 w-px bg-gray-300"></div>
            <button onClick={handleExport} className="bg-sefaz-blue text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2" title="Exportar Dados"><Download size={14}/> Exportar</button>
          </div>
        </div>
      </header>

      {isLoadingData || !dashboardData ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-sefaz-blue animate-spin mb-4"/>
          <p className="text-gray-500 font-medium">Consolidando dados em tempo real...</p>
        </div>
      ) : (
        <div className="p-6 max-w-[1920px] mx-auto w-full space-y-6">
          
          {/* 1. Seção de Alertas Críticos (Com Feedback Visual de Sucesso) */}
          <div className="grid grid-cols-1 gap-4">
            {activeAlerts.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 animate-pulse"><AlertTriangle size={20}/></div>
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Atenção Operacional Necessária</h4>
                    <p className="text-xs text-red-700">{activeAlerts.length} eventos críticos detectados nos últimos 30 minutos.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeAlerts.slice(0,2).map(alert => (
                    <span key={alert.id} className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-white border border-red-200 text-xs font-medium text-red-700 shadow-sm">
                      {alert.texto}
                    </span>
                  ))}
                  <button onClick={() => setShowIncidentsModal(true)} className="px-4 py-2 bg-white border border-red-300 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">Ver Todos <ArrowRight size={12}/></button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
                 <div className="bg-green-100 p-2 rounded-full text-green-600"><ThumbsUp size={20}/></div>
                 <div>
                    <h4 className="font-bold text-green-800 text-sm">Operação Normalizada</h4>
                    <p className="text-xs text-green-700">Todos os sistemas operando dentro dos parâmetros. Nenhum incidente crítico.</p>
                 </div>
              </div>
            )}
          </div>

          {/* 2. Cards de KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Fila de Espera" value={dashboardData.kpis.filaEspera} subtext="pessoas aguardando" icon={Users} colorClass="bg-orange-500 text-orange-600" trend="up" />
            <KPICard title="Tempo Médio (TMA)" value={dashboardData.kpis.tma} subtext="dentro da meta (5m)" icon={Clock} colorClass="bg-blue-500 text-blue-600" trend="down" />
            <KPICard title="Volume Hoje" value={dashboardData.kpis.totalAtendimentos} subtext="+15% vs ontem" icon={Zap} colorClass="bg-purple-500 text-purple-600" trend="up" />
            <KPICard title="CSAT (Satisfação)" value={dashboardData.kpis.satisfacao} subtext="Excelente" icon={Smile} colorClass="bg-green-500 text-green-600" trend="up" />
          </div>

          {/* 3. Área Principal */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Coluna Esquerda - Gráficos e Tabela */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[350px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Curva de Atendimentos (Intraday)</h3>
                  <button onClick={handleExport} className="text-xs text-sefaz-blue font-bold hover:underline">Ver Relatório Completo</button>
                </div>
                <div className="relative h-[270px] w-full">
                  <Line options={lineOptions} data={dashboardData.volumeData} />
                </div>
              </div>

              {/* Tabela Auditável */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText size={18} className="text-gray-400"/> Auditoria Recente</h3>
                  
                  {/* FILTRO DE ATENDENTE (LOCAL) */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                    <Filter size={14} className="text-gray-400 mr-2"/>
                    <span className="text-xs text-gray-500 font-bold mr-2">FILTRAR:</span>
                    <select 
                      value={selectedAgent} 
                      onChange={(e) => setSelectedAgent(e.target.value)} 
                      className="bg-transparent border-none text-xs font-medium text-gray-700 focus:ring-0 cursor-pointer p-0 w-40"
                    >
                      <option value="all">Todos os Atendentes</option>
                      {teamMembersMock.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 font-semibold">
                      <tr><th className="px-6 py-3">Hora</th><th className="px-6 py-3">Atendente</th><th className="px-6 py-3">Canal</th><th className="px-6 py-3">Assunto</th><th className="px-6 py-3 text-center">Nota</th><th className="px-6 py-3 text-center">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTableData.length > 0 ? filteredTableData.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-3 text-gray-500 font-mono">{row.data}</td>
                          <td className="px-6 py-3 font-medium text-gray-900">{row.atendente.name}</td>
                          <td className="px-6 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.canal === 'WhatsApp' ? 'bg-green-100 text-green-800' : row.canal === 'Telefone' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{row.canal}</span></td>
                          <td className="px-6 py-3 text-gray-600">{row.assunto}</td>
                          <td className="px-6 py-3 text-center text-yellow-400 text-xs">{'★'.repeat(row.avaliacao)}</td>
                          <td className="px-6 py-3 text-center">
                            <button onClick={() => setViewingTicket(row)} className="text-gray-400 hover:text-sefaz-blue transition-colors" title="Auditar Conversa"><Eye size={18}/></button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="6" className="text-center py-8 text-gray-400 italic">Nenhum registro encontrado para este filtro.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                  <button className="text-sefaz-blue hover:underline text-xs font-bold">Ver todos os registros</button>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Gestão */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Status da Equipe */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} className="text-gray-400"/> Status da Equipe</h3>
                  <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {teamState.filter(t => t.status === 'online' || t.status === 'busy').length} Online
                  </span>
                </div>
                <div className="space-y-3">
                  {teamState.map(agent => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent} 
                      onMonitor={(a) => setMonitorAgent(a)} 
                      onMessage={(a) => setMessageAgent(a)} 
                    />
                  ))}
                </div>
                <button onClick={() => setShowScheduleModal(true)} className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <MoreHorizontal size={16}/> Gerenciar Escala
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Distribuição por Canal</h3>
                <div className="relative h-[200px]"><Doughnut options={doughnutOptions} data={dashboardData.canalData} /></div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">Canal com maior demanda:</p>
                  <p className="font-bold text-green-600 text-lg">WhatsApp (55%)</p>
                </div>
              </div>

              <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                <h3 className="font-bold text-lg relative z-10">Precisa de ajuda?</h3>
                <p className="text-blue-100 text-sm mt-1 mb-4 relative z-10">Acesse a base de conhecimento interna ou fale com o suporte técnico.</p>
                <button onClick={handleAccessSupport} className="w-full bg-white text-blue-900 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors relative z-10">Acessar Suporte</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}