import React, { useState, useEffect, useRef } from 'react';
import WelcomeModal from '../components/WelcomeModal';
import HistoryModal from '../components/HistoryModal';
import {
  Search, Send, Paperclip, User, Phone, Mail, Clock, MessageSquare, RefreshCw, CheckCircle, Bot, X, Inbox as InboxIcon, Star, ShieldCheck, ShieldAlert, History, PhoneCall, Voicemail, PhoneOff, SendToBack, FileText, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Zap, AlertOctagon
} from 'lucide-react';

// === DADOS MOCKADOS SINCRONIZADOS COM O CONSOLE ===
const mockData = {
  atendente: { name: "Ana Silva", avatar: `https://ui-avatars.com/api/?name=Ana+Silva&background=random&color=fff` },
  conversas: [
    // --- 1. Pedro Thiago (CENÁRIO: IRREGULAR / DÉBITOS) ---
    { 
      id: 1, nome: 'Pedro Thiago', email: 'pedro.thiago@email.com', telefone: '(81) 99123-4567', canal: 'whatsapp', tempo: '2m', lida: false, status: 'aberto', 
      cidadaoInfo: {
        cpf: '123.456.789-00', 
        statusSefaz: 'Irregular', 
        mediaSatisfacao: 4.5,
        pendencias: ['IPVA 2025 em atraso', 'Taxa Bombeiro inscrita'],
        atendimentosAnteriores: [
          { id: 'TKT-1023', data: '20/10/2025', assunto: 'Dúvida IPVA', status: 'Resolvido', rating: 5, messageLog: [ { sender: 'bot', name: 'Assistente Virtual', text: 'Olá...' } ] },
          { id: 'TKT-1009', data: '15/09/2025', assunto: 'Erro Emissão DAE', status: 'Resolvido', rating: 4, messageLog: [ { sender: 'user', text: 'Erro...' } ] }
        ]
      },
      messageLog: [ 
        { sender: 'bot', name: 'Assistente Virtual', text: 'Olá! Sou o Assistente Virtual da Sefaz. Para iniciar, por favor, digite seu CPF ou CNPJ.' }, 
        { sender: 'user', text: '123.456.789-00' }, 
        { sender: 'bot', name: 'Assistente Virtual', text: 'Obrigado, Sr. Pedro. Identifiquei seu cadastro. Constam pendências de IPVA. Qual sua dúvida?' }, 
        { sender: 'user', text: 'Minha NF-e foi rejeitada com o erro 215. O que faço?' }, 
        { sender: 'bot', name: 'Assistente Virtual', text: 'O Erro 215 (Rejeição: Falha no schema XML) geralmente ocorre por uma falha na estrutura do arquivo. Verifique se seu software emissor está atualizado.' }, 
        { sender: 'user', text: 'Já verifiquei e não é isso. Preciso de ajuda.' }, 
        { sender: 'bot', name: 'Assistente Virtual', text: 'Entendido. Vejo que a solução padrão não atendeu. Estou transferindo seu caso para um atendente de Nível 2. Por favor, aguarde.' } 
      ] 
    },
    // --- 2. Paula Roberta (CENÁRIO: PENDENTE / CADASTRO) ---
    { 
      id: 2, nome: 'Paula Roberta', email: 'paula.roberta@email.com', telefone: '(81) 98888-5678', canal: 'telegram', tempo: '5m', lida: false, status: 'aberto', 
      cidadaoInfo: {
        cnpj: '01.234.567/0001-88', 
        statusSefaz: 'Pendente', 
        mediaSatisfacao: 3.0,
        pendencias: ['Atualização Cadastral CACEPE'],
        atendimentosAnteriores: [
          { id: 'TKT-1011', data: '01/10/2025', assunto: 'Pendência DTE', status: 'Resolvido', rating: 3, messageLog: [{ sender: 'user', text: 'Minha DTE está pendente.'},{ sender: 'atendente', name: 'Carlos (Atendente Antigo)', text: 'Resolvido.'}, { sender: 'rating', stars: 3 }] }
        ]
      },
      messageLog: [ { sender: 'bot', name: 'Assistente Virtual', text: 'Olá! Sou o Assistente Virtual da Sefaz. Para iniciar, por favor, digite seu CPF ou CNPJ.' }, { sender: 'user', text: '01.234.567/0001-88' }, { sender: 'bot', name: 'Assistente Virtual', text: 'Obrigado, Sra. Paula (Empresa XYZ). Qual sua dúvida?' }, { sender: 'user', text: 'Não consigo emitir a DAE para o código de receita 1011.' }, { sender: 'bot', name: 'Assistente Virtual', text: 'O código 1011 (ICMS Normal) pode estar indisponível se houver pendências. Verifique seu Domicílio Tributário Eletrônico (DTE) para avisos.' }, { sender: 'user', text: 'Meu DTE está limpo. O sistema de DAE está com erro. Preciso de ajuda humana.' }, { sender: 'bot', name: 'Assistente Virtual', text: 'Peço desculpas. A solução informada não foi satisfatória. Estou transferindo para um atendente de Nível 2. Por favor, aguarde.' } ] 
    },
    // --- 3. Silvio Vicente (CENÁRIO: REGULAR) ---
    { 
      id: 3, nome: 'Silvio Vicente', email: 'silvio.vicente@web.com', telefone: 'N/A', canal: 'web', tempo: '1h', lida: false, status: 'transferido', 
      cidadaoInfo: { 
        cpf: '987.654.321-11', 
        statusSefaz: 'Regular', 
        mediaSatisfacao: 5.0, 
        pendencias: [],
        atendimentosAnteriores: [
          { id: 'TKT-998', data: '10/08/2025', assunto: 'Calendário IPVA', status: 'Resolvido', rating: 5, messageLog: [{ sender: 'user', text: 'Qual o calendário?'}, {sender: 'atendente', name: 'Carlos', text: 'Aqui está.'}, { sender: 'rating', stars: 5 }] }
        ]
      },
      messageLog: [ 
        { sender: 'bot', name: 'Assistente Virtual', text: 'Olá! Qual sua dúvida?' }, 
        { sender: 'user', text: 'Preciso de uma isenção especial de ICMS que a atendente anterior não conseguiu resolver.' }, 
        { sender: 'atendente', name: 'Ana Silva', text: 'Sr. Silvio, este caso envolve regime especial. Vou transferir para a supervisão.' },
        { sender: 'sys', text: 'Atendimento transferido para Supervisor.' }
      ] 
    },
    // --- 4. Mariana Costa (Telefone) ---
    { 
      id: 14, nome: 'Mariana Costa', email: 'mari.costa@email.com', telefone: '(81) 99111-0000', canal: 'telefone', tempo: '1m', lida: false, status: 'aberto', 
      cidadaoInfo: { 
        cpf: '777.888.999-00', 
        statusSefaz: 'Regular', 
        mediaSatisfacao: 4.1, 
        pendencias: [],
        atendimentosAnteriores: [
          { id: 'TKT-1020', data: '18/10/2025', assunto: 'Dúvida NF Avulsa', status: 'Resolvido', rating: 4, messageLog: [{sender: 'user', text: 'NFA'}, {sender: 'atendente', name: 'Ana', text: 'Resolvido.'}, {sender: 'rating', stars: 4}] }
        ]
      },
      messageLog: [ { sender: 'ura', name: 'URA Sefaz', text: 'Olá! Bem-vindo à Sefaz. Digite 1 para IPVA, 2 para NF-e, 3 para DAE, 4 para outros.' }, { sender: 'user', text: '[Usuário digitou "2"]' }, { sender: 'ura', name: 'URA Sefaz', text: 'NF-e. Para consulta, digite 1. Para erros de emissão, digite 2.' }, { sender: 'user', text: '[Usuário digitou "2"]' }, { sender: 'ura', name: 'URA Sefaz', text: 'Por favor, acesse sefaz.pe.gov.br/manuais para ver a lista de erros. Essa informação foi útil?' }, { sender: 'user', text: '[Usuário digitou "2" (Não)]' }, { sender: 'ura', name: 'URA Sefaz', text: 'Entendido. Vou transferir para um de nossos atendentes. Por favor, aguarde na linha. Sua posição na fila é 1.' } ] 
    },
    // --- 6. Lucia Ferraz (Resolvido) ---
    { 
      id: 11, nome: 'Lucia Ferraz', email: 'lucia@email.com', telefone: '(81) 99555-6677', canal: 'whatsapp', tempo: 'Ontem', lida: true, status: 'resolvido', 
      cidadaoInfo: { cpf: '444.555.666-77', statusSefaz: 'Regular', mediaSatisfacao: 5.0, atendimentosAnteriores: [] }, 
      messageLog: [ { sender: 'bot', name: 'Assistente Virtual', text: 'Olá! Sou o Assistente Virtual da Sefaz. Qual sua dúvida?' }, { sender: 'user', text: 'Como emito CND?' }, { sender: 'bot', name: 'Assistente Virtual', text: 'A CND (Certidão Negativa de Débitos) pode ser emitida em nosso site, menu "Certidões".' }, { sender: 'user', text: 'O site diz que tenho pendências, mas não sei quais são.' }, { sender: 'bot', name: 'Assistente Virtual', text: 'Entendido. Para consultar pendências, o atendente precisará confirmar seus dados. Transferindo. Por favor, aguarde.' }, { sender: 'atendente', name: 'Ana Silva', text: 'Olá, Sra. Lucia. Sou a Ana. Verifiquei seu CPF e consta uma pendência de DAE (código 1011) de 2023, no valor de R$ 45,00.' }, { sender: 'user', text: 'Nossa, é verdade! Paguei agora. Pode verificar?' }, { sender: 'atendente', name: 'Ana Silva', text: 'A compensação pode levar alguns minutos. ... Pronto, verifiquei e o débito já saiu do sistema. Tente emitir a CND agora, por favor.' }, { sender: 'user', text: 'CONSEGUI! Muito obrigada!!' }, { sender: 'atendente', name: 'Ana Silva', text: 'Fico feliz em ajudar! O atendimento será encerrado. Em breve, você receberá uma pesquisa de satisfação.' }, { sender: 'rating', stars: 5 } ] 
    },
  ]
};

const quickReplies = [
  { id: 1, label: "👋 Saudação", text: "Olá! Sou eu quem vai dar continuidade ao seu atendimento. Em que posso ajudar?" },
  { id: 2, label: "📄 Pedir CPF", text: "Para prosseguir, por favor me informe o número do CPF ou CNPJ sem pontuação." },
  { id: 3, label: "⏳ Aguarde", text: "Vou verificar essa informação no sistema. Um momento, por favor." },
  { id: 4, label: "💻 Link DAE", text: "Você pode emitir a guia DAE diretamente no portal: www.sefaz.pe.gov.br/dae" },
  { id: 5, label: "✅ Confirmar", text: "Confirmo que o procedimento foi realizado com sucesso no sistema." },
  { id: 6, label: "⛔ Encerramento", text: "Posso ajudar em algo mais? Caso contrário, vou encerrar este atendimento." },
];

const CanalIcon = ({ canal }) => {
  if (canal === 'whatsapp') return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">W</div>;
  if (canal === 'telegram') return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">T</div>;
  if (canal === 'web') return <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white ring-2 ring-white"><MessageSquare size={12} /></div>;
  if (canal === 'telefone') return <div className="w-5 h-5 bg-sefaz-blue rounded-full flex items-center justify-center text-white ring-2 ring-white"><PhoneCall size={10} /></div>;
  return null;
};

const RatingStars = ({ count, small = false }) => {
  return (
    <div className="flex items-center">
      {Array(5).fill(0).map((_, i) => (
        <Star key={i} className={`${small ? 'w-4 h-4' : 'w-5 h-5'} ${i < count ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < count ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
};

const getLastMessagePreview = (messageLog) => {
  if (!messageLog || messageLog.length === 0) return "...";
  const lastMessage = messageLog[messageLog.length - 1];
  if (lastMessage.sender === 'rating') return `Avaliação: ${lastMessage.stars} estrela(s)`;
  if (lastMessage.sender === 'sys') return `Sistema: ${lastMessage.text}`;
  return lastMessage.text || "...";
};

const CallTimer = ({ isActive }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => { setSeconds(s => s + 1); }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  return (
    <div className="flex items-center text-lg font-semibold text-red-600">
      <span className="relative flex h-3 w-3 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      {formatTime(seconds)}
    </div>
  );
};


export default function InboxPage({ userRole = 'agent', onOpenConsole, hasSeenWelcomeModal, onCloseWelcomeModal, currentSlaTime, consoleReturnData, onClearConsoleReturn }) {
  
  const isAdmin = userRole === 'admin';
  const currentAttendantName = isAdmin ? "Vinicius Dantas" : "Ana Silva";
  const [atendente, setAtendente] = useState({ name: currentAttendantName, avatar: `https://ui-avatars.com/api/?name=${currentAttendantName.replace(' ', '+')}&background=random&color=fff` });

  useEffect(() => {
    setAtendente({ name: currentAttendantName, avatar: `https://ui-avatars.com/api/?name=${currentAttendantName.replace(' ', '+')}&background=random&color=fff` });
  }, [currentAttendantName]);

  // Se consoleReturnData existir, atualiza o chat correspondente
  useEffect(() => {
    if (consoleReturnData) {
      setConversas(prev => prev.map(c => {
        if (c.id === consoleReturnData.id) {
          // Mescla o histórico antigo com o novo vindo do console
          return { 
            ...c, 
            messageLog: consoleReturnData.messageLog || c.messageLog 
          };
        }
        return c;
      }));
      setActiveChatId(consoleReturnData.id);
      if (onClearConsoleReturn) onClearConsoleReturn();
    }
  }, [consoleReturnData, onClearConsoleReturn]);

  const shouldShowModal = !isAdmin && !hasSeenWelcomeModal;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);       
  const [conversas, setConversas] = useState(mockData.conversas);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState(isAdmin ? 'transferidos' : 'aguardando');
  const [searchQuery, setSearchQuery] = useState("");
  const [callStatus, setCallStatus] = useState('idle');
  const [viewingHistoryTicket, setViewingHistoryTicket] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferStep, setTransferStep] = useState('confirm');

  // === AUTO-SCROLL LOGIC ===
  const messagesEndRef = useRef(null);
  const conversaAtiva = conversas.find(c => c.id === activeChatId);
  const isCall = conversaAtiva && conversaAtiva.canal === 'telefone';

  // Rola para o fim sempre que o histórico de mensagens mudar ou o chat ativo mudar
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversaAtiva?.messageLog, activeChatId, showTranscript]);

  const conversasVisiveis = conversas.filter(conversa => {
    let matchesTab = false;
    if (activeTab === 'aguardando') matchesTab = conversa.status === 'aberto';
    else if (activeTab === 'transferidos') matchesTab = conversa.status === 'transferido';
    else if (activeTab === 'resolvidos') matchesTab = conversa.status === 'resolvido';
    const matchesSearch = (searchQuery.trim() === "" || conversa.nome.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowTranscript(false);
    const selectedChat = conversas.find(c => c.id === id);
    setCallStatus('idle'); 
    if (selectedChat.canal === 'telefone') {
      if (selectedChat.status === 'aberto' || selectedChat.status === 'transferido') setCallStatus('waiting');
      else if (selectedChat.status === 'resolvido') { setCallStatus('completed'); setShowTranscript(true); }
    }
    setConversas(prev => prev.map(c => c.id === id ? { ...c, lida: true } : c));
  };

  const sendMessage = (text) => {
    const novaMensagem = { sender: 'atendente', name: atendente.name, text: text };
    setConversas(prevConversas => prevConversas.map(conversa => {
        if (conversa.id === activeChatId) { return { ...conversa, messageLog: [...conversa.messageLog, novaMensagem] }; }
        return conversa;
    }));
    setInputMessage("");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    sendMessage(inputMessage);
  };

  const handleStartCall = () => { setCallStatus('active'); };
  const handleResolve = () => {
    if (isCall) setCallStatus('ended');
    else {
      setConversas(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'resolvido' } : c));
      setActiveChatId(null);
      setIsDetailsOpen(false);
    }
  };
  const handleSendToSurvey = () => {
    const ratingMsg = { sender: 'rating', stars: 5 };
    setConversas(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'resolvido', messageLog: [...c.messageLog, ratingMsg] } : c));
    setActiveChatId(null);
    setIsDetailsOpen(false);
    setCallStatus('idle');
  };
  const openTransferModal = () => { setTransferStep('confirm'); setIsTransferModalOpen(true); };
  const confirmTransfer = () => {
    setConversas(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'transferido' } : c));
    setTransferStep('success');
  };
  const closeTransferModal = () => { setIsTransferModalOpen(false); setActiveChatId(null); setIsDetailsOpen(false); };

  // === INTEGRAÇÃO COM O CONSOLE ===
  const handleNavigateToConsole = () => {
    if (!conversaAtiva) return;
    if (onCloseWelcomeModal) onCloseWelcomeModal();
    
    const taxpayerData = {
      id: conversaAtiva.id, 
      nome: conversaAtiva.nome,
      docPrincipal: conversaAtiva.cidadaoInfo?.cpf || conversaAtiva.cidadaoInfo?.cnpj || '000.000.000-00',
      type: conversaAtiva.cidadaoInfo?.cnpj ? 'PJ' : 'PF',
      contato: { email: conversaAtiva.email, tel: conversaAtiva.telefone },
      statusGeral: conversaAtiva.cidadaoInfo?.statusSefaz?.toLowerCase() || 'regular',
      messageLog: conversaAtiva.messageLog,
      canal: conversaAtiva.canal
    };
    onOpenConsole(taxpayerData);
  };

  const formatSlaTime = (totalSeconds) => {
    if (totalSeconds === undefined) return "00:00";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      {shouldShowModal && (
        <WelcomeModal 
          queueCount={conversas.filter(c => c.status === 'aberto' && !c.lida).length} 
          onClose={onCloseWelcomeModal}
          userName={atendente.name} 
          role={userRole}
        />
      )}
      {viewingHistoryTicket && <HistoryModal ticket={viewingHistoryTicket} atendente={atendente} onClose={() => setViewingHistoryTicket(null)} />}
      
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in duration-300">
            {transferStep === 'confirm' ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4"><RefreshCw className="h-6 w-6 text-sefaz-blue" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Transferência</h3>
                <p className="text-sm text-gray-500 mb-6">Você deseja transferir este atendimento para o Supervisor <strong>Vinicius Dantas</strong>?</p>
                <div className="flex justify-center space-x-3"><button onClick={() => setIsTransferModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button><button onClick={confirmTransfer} className="px-4 py-2 bg-sefaz-blue text-white rounded-lg">Transferir</button></div>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4"><CheckCircle className="h-6 w-6 text-green-600" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sucesso!</h3>
                <p className="text-sm text-gray-500 mb-6">O atendimento foi transferido com sucesso.</p>
                <button onClick={closeTransferModal} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Fechar</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-10 h-full min-h-0">
        
        <aside className="col-span-10 md:col-span-3 lg:col-span-3 h-full border-r border-gray-200 bg-white flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-sefaz-blue">Fila de Atendimento</h2>
            <div className="relative mt-2">
              <input type="text" placeholder="Buscar por nome, e-mail, tel..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {!isAdmin && <button onClick={() => setActiveTab('aguardando')} className={`flex-1 p-3 text-sm font-medium text-center ${ activeTab === 'aguardando' ? 'border-b-2 border-sefaz-blue text-sefaz-blue' : 'text-gray-500 hover:bg-gray-50' }`}> Aguardando ({conversas.filter(c => c.status === 'aberto').length}) </button>}
            {isAdmin && <button onClick={() => setActiveTab('transferidos')} className={`flex-1 p-3 text-sm font-medium text-center ${ activeTab === 'transferidos' ? 'border-b-2 border-sefaz-blue text-sefaz-blue' : 'text-gray-500 hover:bg-gray-50' }`}> Transferidos ({conversas.filter(c => c.status === 'transferido').length}) </button>}
            <button onClick={() => setActiveTab('resolvidos')} className={`flex-1 p-3 text-sm font-medium text-center ${ activeTab === 'resolvidos' ? 'border-b-2 border-sefaz-blue text-sefaz-blue' : 'text-gray-500 hover:bg-gray-50' }`}> Resolvidos ({conversas.filter(c => c.status === 'resolvido').length}) </button>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {conversasVisiveis.map((conversa) => (
              <div key={conversa.id} onClick={() => handleSelectChat(conversa.id)} className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${ conversa.id === activeChatId ? 'bg-sefaz-background' : 'hover:bg-gray-50' }`}>
                <div className="relative flex-shrink-0">
                  <img className="w-10 h-10 rounded-full" src={`https://ui-avatars.com/api/?name=${conversa.nome.replace(' ', '+')}&background=e6f0f9&color=004a91`} alt={conversa.nome} />
                  <div className="absolute -bottom-1 -right-1"> <CanalIcon canal={conversa.canal} /> </div>
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold truncate">{conversa.nome}</h3>
                    <span className="text-xs text-gray-500">{conversa.tempo}</span>
                  </div>
                  <p className={`text-xs truncate ${ !conversa.lida && (conversa.status === 'aberto' || conversa.status === 'transferido') ? 'font-bold text-gray-800' : 'text-gray-500' }`}>
                    {getLastMessagePreview(conversa.messageLog)}
                  </p>
                </div>
                {!conversa.lida && (conversa.status === 'aberto' || conversa.status === 'transferido') && ( <div className="w-2 h-2 bg-sefaz-blue-light rounded-full ml-2 mt-1 flex-shrink-0" /> )}
              </div>
            ))}
            {conversasVisiveis.length === 0 && ( <div className="p-10 text-center text-gray-400"> <InboxIcon className="w-12 h-12 mx-auto" /> <p className="mt-2 text-sm"> {searchQuery.trim() === "" ? "Nenhum atendimento nesta fila." : "Nenhum resultado encontrado."} </p> </div> )}
          </div>
        </aside>

        {!conversaAtiva ? (
          <div className={` hidden md:flex md:col-span-7 h-full flex-col bg-sefaz-background-light items-center justify-center text-center p-10 ${isDetailsOpen ? 'lg:col-span-4' : 'lg:col-span-7'} `}>
            <InboxIcon className="w-16 h-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-500"> Nenhum atendimento selecionado </h2>
            <p className="text-gray-400"> Selecione um item na fila para iniciar o atendimento. </p>
          </div>
        ) : (
          <section className={` hidden md:flex h-full flex-col bg-sefaz-background-light min-h-0 ${isDetailsOpen ? 'md:col-span-7 lg:col-span-4' : 'md:col-span-7 lg:col-span-7'} `}>
            <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-sefaz-blue">{conversaAtiva.nome}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-5 h-5"> <CanalIcon canal={conversaAtiva.canal} /> </div>
                  <span className="ml-2">Via {conversaAtiva.canal}</span>
                  <span className="mx-2">|</span>
                  
                  {/* === LOGICA DE SLA CORRIGIDA PARA TELEFONE === */}
                  {isCall ? (
                    callStatus === 'active' ? (
                      <CallTimer isActive={true} />
                    ) : callStatus === 'waiting' ? (
                      <div className="flex items-center text-gray-400 bg-gray-100 px-2 py-1 rounded text-xs">
                        <Phone size={14} className="mr-1" /> Aguardando Início
                      </div>
                    ) : conversaAtiva.status === 'resolvido' ? (
                       <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                         <CheckCircle size={16} className="mr-1" /> <span className="text-xs font-bold uppercase">Finalizado</span>
                       </div>
                    ) : null
                  ) : (
                    // Para Chats (WhatsApp/Web/Telegram), mostra o SLA Global ou Finalizado
                    conversaAtiva.status === 'resolvido' ? (
                      <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                        <CheckCircle size={16} className="mr-1" /> <span className="text-xs font-bold uppercase">Finalizado</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sefaz-blue">
                        <Clock size={16} className="mr-1" /> SLA: <strong>{formatSlaTime(currentSlaTime)}</strong>
                      </div> 
                    )
                  )}
                </div>
              </div>
              {!isDetailsOpen && ( <button onClick={() => setIsDetailsOpen(true)} title="Ver Detalhes do Cidadão" className="p-2 text-gray-500 hover:text-sefaz-blue rounded-full hover:bg-gray-100"> <User size={20} /> </button> )}
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isCall && callStatus === 'waiting' && ( <div className="flex flex-col items-center justify-center h-full text-center"> <PhoneCall className="w-16 h-16 text-sefaz-blue" /> <h2 className="mt-4 text-xl font-semibold text-gray-700">Ligação em Espera</h2> <p className="text-gray-500">O contribuinte está aguardando na linha.</p> <button onClick={handleStartCall} className="mt-6 flex items-center justify-center p-3 px-6 text-lg rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors" > <PhoneCall className="w-5 h-5 mr-2" /> Iniciar Atendimento </button> <button onClick={() => setShowTranscript(!showTranscript)} className="mt-4 flex items-center text-sefaz-blue hover:underline" > <FileText className="w-4 h-4 mr-1" /> {showTranscript ? "Ocultar Transcrição" : "Ver Transcrição da URA"} {showTranscript ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />} </button> </div> )}
              {isCall && callStatus === 'active' && ( <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-lg shadow"> <PhoneCall className="w-16 h-16 text-green-500 animate-pulse" /> <h2 className="mt-4 text-xl font-semibold text-gray-700">Ligação Ativa</h2> <p className="text-gray-500">Atendimento em andamento...</p> <div className="flex space-x-4 mt-4"> {conversaAtiva.status !== 'transferido' && ( <button onClick={openTransferModal} className="flex items-center px-4 py-2 bg-white border border-sefaz-blue text-sefaz-blue rounded-lg hover:bg-blue-50 shadow-sm transition-colors"> <RefreshCw className="w-4 h-4 mr-2" /> Transferir </button> )} <button onClick={handleResolve} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-colors"> <PhoneOff className="w-4 h-4 mr-2" /> Finalizar Ligação </button> </div> <button onClick={() => setShowTranscript(!showTranscript)} className="mt-4 flex items-center text-sefaz-blue hover:underline" > <FileText className="w-4 h-4 mr-1" /> {showTranscript ? "Ocultar Transcrição" : "Ver Transcrição da URA"} {showTranscript ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />} </button> </div> )}
              {isCall && callStatus === 'ended' && ( <div className="flex flex-col items-center justify-center h-full text-center"> <PhoneOff className="w-16 h-16 text-red-500" /> <h2 className="mt-4 text-xl font-semibold text-gray-700">Ligação Finalizada</h2> <p className="text-gray-500">O atendimento foi resolvido.</p> <button onClick={handleSendToSurvey} className="mt-6 flex items-center justify-center p-3 px-6 text-lg rounded-lg bg-sefaz-blue text-white hover:bg-sefaz-blue-dark transition-colors" > <SendToBack className="w-5 h-5 mr-2" /> Redirecionar para Pesquisa </button> <button onClick={() => setShowTranscript(!showTranscript)} className="mt-4 flex items-center text-sefaz-blue hover:underline" > <FileText className="w-4 h-4 mr-1" /> {showTranscript ? "Ocultar Transcrição" : "Ver Transcrição da URA"} {showTranscript ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />} </button> </div> )}
              {isCall && callStatus === 'completed' && ( <div className="flex flex-col items-center justify-center p-6 bg-green-50 border-b border-green-100 text-center mb-4"> <div className="p-3 bg-green-100 rounded-full mb-2"> <CheckCircle className="w-8 h-8 text-green-600" /> </div> <h2 className="text-lg font-bold text-green-800">Atendimento Telefônico Concluído</h2> <p className="text-sm text-green-600">O contribuinte foi direcionado para a pesquisa.</p> </div> )}
              {(!isCall || showTranscript) && conversaAtiva.messageLog.map((msg, index) => { if (msg.sender === 'atendente') { return ( <div key={index} className="flex items-start"> <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 overflow-hidden"><img src={atendente.avatar} alt="Avatar Atendente" className="w-full h-full rounded-full"/></div> <div className="ml-3 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-lg"><p className="text-sm font-medium text-sefaz-blue-light">{msg.name}</p><p className="text-sm text-gray-700">{msg.text}</p></div> </div> ); } if (msg.sender === 'bot') { return ( <div key={index} className="flex items-start"> <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sefaz-blue flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div> <div className="ml-3 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-lg"><p className="text-sm font-medium text-sefaz-blue">{msg.name}</p><p className="text-sm text-gray-700">{msg.text}</p></div> </div> ); } if (msg.sender === 'ura') { return ( <div key={index} className="flex items-start"> <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><Voicemail className="w-5 h-5 text-white" /></div> <div className="ml-3 bg-gray-100 p-3 rounded-lg rounded-tl-none shadow-sm max-w-lg"><p className="text-sm font-medium text-gray-700">{msg.name}</p><p className="text-sm text-gray-600 italic">{msg.text}</p></div> </div> ); } if (msg.sender === 'rating') { return ( <div key={index} className="py-2"> <div className="relative text-center"> <span className="px-2 bg-sefaz-background-light text-sm text-gray-500"> Atendimento Avaliado </span> </div> <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm border mt-2"> <RatingStars count={msg.stars} /> </div> </div> ); } if (msg.sender === 'sys') { return ( <div key={index} className="py-2 text-center text-xs text-gray-400 italic"> {msg.text} </div> ); } return ( <div key={index} className="flex justify-end"> <div className="mr-3 bg-green-100 p-3 rounded-lg rounded-tr-none shadow-sm max-w-lg"><p className="text-sm text-gray-700">{msg.text}</p></div> </div> ); })}
              
              {/* REF INVISÍVEL PARA SCROLL */}
              <div ref={messagesEndRef} />
            </div>

            {conversaAtiva.status !== 'resolvido' && (conversaAtiva.status === 'aberto' || conversaAtiva.status === 'transferido') && !isCall && ( 
              <footer className="bg-white border-t border-gray-200 flex-shrink-0 flex flex-col">
                <div className="flex space-x-2 p-3 overflow-x-auto bg-gray-50 border-b border-gray-100 scrollbar-thin scrollbar-thumb-gray-200">
                  <div className="flex items-center text-xs text-gray-500 font-semibold mr-2 uppercase tracking-wider">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" /> Rápido:
                  </div>
                  {quickReplies.map((reply) => (
                    <button key={reply.id} onClick={() => sendMessage(reply.text)} className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-blue-50 hover:border-sefaz-blue hover:text-sefaz-blue transition-colors shadow-sm whitespace-nowrap" title={reply.text}>{reply.label}</button>
                  ))}
                </div>
                <div className="relative flex items-center p-4">
                  <textarea rows="1" placeholder="Digite sua resposta..." className="flex-1 p-3 pr-20 border rounded-lg resize-none" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                  <button className="absolute right-12 p-2 text-gray-500 hover:text-sefaz-blue-light"><Paperclip className="w-5 h-5" /></button>
                  <button className="absolute right-2 p-2 bg-sefaz-blue text-white rounded-lg hover:bg-sefaz-blue-dark" onClick={handleSendMessage}><Send className="w-5 h-5" /></button>
                </div>
              </footer>
            )}
          </section>
        )}

        <aside className={` h-full flex flex-col min-h-0 ${isDetailsOpen && conversaAtiva ? 'lg:flex lg:col-span-3 border-l border-gray-200 bg-white' : 'hidden'} `}>
          {conversaAtiva && ( 
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-sefaz-blue">Detalhes do Cidadão</h2>
                <button onClick={() => setIsDetailsOpen(false)} title="Fechar Detalhes" className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50" > <X size={20} /> </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${conversaAtiva.nome.replace(' ', '+')}&background=e6f0f9&color=004a91`} alt="Avatar do Cidadão" className="w-full h-full" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{conversaAtiva.nome}</h3>
                  <span className="text-sm text-gray-500">Contribuinte</span>
                </div>

                {/* === ALINHAMENTO DE STATUS COM O CONSOLE === */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs text-gray-500 font-medium">Status SEFAZ</h4>
                    <div className={`flex items-center mt-1 font-semibold ${conversaAtiva.cidadaoInfo.statusSefaz === 'Regular' ? 'text-green-600' : ''} ${conversaAtiva.cidadaoInfo.statusSefaz === 'Pendente' ? 'text-orange-500' : ''} ${conversaAtiva.cidadaoInfo.statusSefaz === 'Irregular' ? 'text-red-600' : 'text-gray-400'} `}>
                      {conversaAtiva.cidadaoInfo.statusSefaz === 'Regular' && <ShieldCheck className="w-4 h-4 mr-1" />}
                      {conversaAtiva.cidadaoInfo.statusSefaz === 'Pendente' && <ShieldAlert className="w-4 h-4 mr-1" />}
                      {conversaAtiva.cidadaoInfo.statusSefaz === 'Irregular' && <AlertCircle className="w-4 h-4 mr-1" />}
                      {conversaAtiva.cidadaoInfo.statusSefaz}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs text-gray-500 font-medium">Satisfação Média</h4>
                    <div className="flex items-center mt-1">
                      {conversaAtiva.cidadaoInfo.mediaSatisfacao ? ( <> <RatingStars count={conversaAtiva.cidadaoInfo.mediaSatisfacao} small={true} /> <span className="ml-2 text-sm font-semibold text-gray-700">{conversaAtiva.cidadaoInfo.mediaSatisfacao.toFixed(1)}</span> </> ) : ( <span className="text-sm text-gray-400">N/A</span> )}
                    </div>
                  </div>
                </div>

                {/* === PENDÊNCIAS (Visível se Irregular ou Pendente) === */}
                {(conversaAtiva.cidadaoInfo.statusSefaz === 'Irregular' || conversaAtiva.cidadaoInfo.statusSefaz === 'Pendente') && conversaAtiva.cidadaoInfo.pendencias && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center"><AlertOctagon className="w-3 h-3 mr-1"/> Pendências Identificadas</h4>
                    <ul className="text-sm text-red-700 space-y-1 list-disc pl-4">
                      {conversaAtiva.cidadaoInfo.pendencias.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Dados do Contribuinte</h4>
                  <div className="space-y-2 text-sm">
                    {conversaAtiva.cidadaoInfo.cpf && ( <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" /><span className="text-gray-700">{conversaAtiva.cidadaoInfo.cpf}</span></div> )}
                    {conversaAtiva.cidadaoInfo.cnpj && ( <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" /><span className="text-gray-700">{conversaAtiva.cidadaoInfo.cnpj}</span></div> )}
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400" /><span className="text-gray-700 truncate">{conversaAtiva.email}</span></div>
                    <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" /><span className="text-gray-700">{conversaAtiva.telefone}</span></div>
                    <div className="flex items-center"><span className="font-semibold mr-1 ml-6">Canal Atual:</span><span className="text-gray-700 capitalize">{conversaAtiva.canal}</span></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Histórico de Atendimentos</h4>
                  {conversaAtiva.cidadaoInfo.atendimentosAnteriores.length > 0 ? (
                    <ul className="space-y-2">
                      {conversaAtiva.cidadaoInfo.atendimentosAnteriores.map((ticket) => (
                        <li key={ticket.id} onClick={() => setViewingHistoryTicket(ticket)} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <div className="flex justify-between items-center"> <span className="text-sm font-medium text-sefaz-blue">{ticket.assunto}</span> <span className="text-xs text-gray-500">{ticket.data}</span> </div>
                          <div className="flex items-center justify-between mt-1"> <span className="text-xs text-gray-500">ID: {ticket.id}</span> <RatingStars count={ticket.rating} small={true} /> </div>
                        </li>
                      ))}
                    </ul>
                  ) : ( <span className="text-sm text-gray-400">Nenhum atendimento anterior.</span> )}
                </div>

                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Ações do Atendimento</h4>
                  <div className="space-y-2">
                    {conversaAtiva.status === 'aberto' && !isCall && ( 
                      <button onClick={openTransferModal} className="w-full flex items-center justify-center p-2 text-sm rounded-lg border border-sefaz-blue text-sefaz-blue hover:bg-sefaz-blue hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4 mr-2" /> Transferir
                      </button> 
                    )}
                    {(conversaAtiva.status === 'aberto' || conversaAtiva.status === 'transferido') && !isCall && (
                      <button onClick={handleResolve} className="w-full flex items-center justify-center p-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors" >
                        <CheckCircle className="w-4 h-4 mr-2" /> Resolver Atendimento
                      </button>
                    )}
                    {/* Botão Console no Rodapé */}
                    <button onClick={handleNavigateToConsole} className="w-full flex items-center justify-center p-4 mt-4 bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1">
                      <ExternalLink className="w-5 h-5 mr-2" /> Abrir Console Fiscal (360°)
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}