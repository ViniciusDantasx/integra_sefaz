import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Save, X, Bot, 
  BrainCircuit, AlertTriangle, MessageSquare, Gavel, UploadCloud, FileText, CheckCircle, Loader2,
  Activity, ThumbsUp, ThumbsDown, Play, Settings, Zap, Cpu, RefreshCw, ArrowRight, User
} from 'lucide-react';

// ==================================================================================
// 1. DADOS MOCKADOS E UTILITÁRIOS
// ==================================================================================

const mockKnowledgeBase = [
  { id: 1, categoria: 'ICMS Fronteiras', topico: 'Liberação de Mercadoria Retida', gatilhos: ['caminhão parado', 'mercadoria retida'], resposta: 'Para liberação de mercadoria retida por ICMS Antecipado, o contribuinte deve emitir o DAE sob o código de receita 058-2...', legislacao: 'Dec. 44.650/2017', status: 'ativo', confianca: 98 },
  { id: 2, categoria: 'NFe', topico: 'Cancelamento Extemporâneo', gatilhos: ['cancelar nota fora do prazo', 'multa cancelamento'], resposta: 'O prazo regulamentar é de 24h. Após esse período, multa de 1% a 5% do valor.', legislacao: 'Lei 15.730/2016', status: 'ativo', confianca: 95 },
  { id: 3, categoria: 'IPVA', topico: 'Isenção de IPVA para PCD', gatilhos: ['isenção deficiente', 'autismo ipva'], resposta: 'A isenção aplica-se a veículos de até R$ 70.000 (total) ou R$ 120.000 (parcial).', legislacao: 'Lei 10.849/1992', status: 'ativo', confianca: 92 },
];

const mockTrainingSuggestions = [
  { id: 101, perguntaUsuario: "meu contador sumiu como eu troco no sistema?", frequencia: 15, confiancaIA: 20, data: 'Hoje, 08:12' },
  { id: 102, perguntaUsuario: "qual o valor da uferc hoje?", frequencia: 8, confiancaIA: 55, data: 'Ontem, 16:40' },
  { id: 103, perguntaUsuario: "recebi um email de malha fiscal é golpe?", frequencia: 45, confiancaIA: 40, data: 'Hoje, 09:00' },
];

// KPIs de Saúde da IA
const aiStats = {
  totalInteractions: 15420,
  accuracy: 94.2,
  handoffRate: 12.5, // Taxa de transbordo para humano
  avgResponseTime: 1.8 // segundos
};

// ==================================================================================
// 2. COMPONENTES VISUAIS (DASHBOARD UI)
// ==================================================================================

const AICard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-all group cursor-default">
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 group-hover:text-sefaz-blue transition-colors">{value}</h3>
      {subtext && <p className="text-xs font-medium text-gray-500 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-').replace('bg-opacity-10', '')} />
    </div>
  </div>
);

// Modal de Teste (Playground) - VERSÃO BLINDADA
const TestPlayground = ({ rule, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ id: 1, sender: 'bot', text: 'Olá! O ambiente de teste está pronto. Simule uma pergunta do usuário abaixo para validar os gatilhos.' }]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll seguro
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input; 
    setInput('');
    setIsTyping(true);

    // Simulação de processamento
    setTimeout(() => {
      const triggers = rule?.gatilhos || [];
      const topic = rule?.topico || '';
      
      // Verifica match com segurança
      const isMatch = triggers.some(g => g && currentInput.toLowerCase().includes(g.toLowerCase())) || 
                      (topic && currentInput.toLowerCase().includes(topic.toLowerCase()));
      
      const responseText = isMatch 
        ? (rule?.resposta || "Regra identificada, mas sem resposta definida.")
        : "Não identifiquei correspondência com a regra atual. Tente usar uma das palavras-chave cadastradas.";
      
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: responseText, isMatch };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-gray-50 w-full md:w-96 flex-shrink-0">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-700 flex items-center gap-2"><Play size={16} className="text-sefaz-blue"/> Simulador</h3>
        <button onClick={onClose} title="Fechar Simulador" className="text-gray-400 hover:text-red-500"><X size={16}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg text-sm shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
              {m.text}
              {m.sender === 'bot' && m.isMatch !== undefined && (
                <div className={`mt-2 pt-2 border-t border-gray-100 text-[10px] font-bold uppercase flex items-center gap-1 ${m.isMatch ? 'text-green-600' : 'text-orange-500'}`}>
                  {m.isMatch ? <CheckCircle size={10}/> : <AlertTriangle size={10}/>}
                  {m.isMatch ? 'Match Confirmado' : 'Sem Correspondência'}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex items-center gap-1 ml-2 text-gray-400 text-xs"><Loader2 size={12} className="animate-spin"/> Gerando resposta...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="relative">
          <input 
            className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue outline-none"
            placeholder="Teste uma frase..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button onClick={handleSend} className="absolute right-2 top-2 text-sefaz-blue hover:text-blue-800 p-0.5 rounded-md hover:bg-blue-50 transition-colors">
            <Send size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 3. PÁGINA PRINCIPAL
// ==================================================================================

export default function GestaoIAPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [knowledgeList, setKnowledgeList] = useState(mockKnowledgeBase);
  const [trainingList, setTrainingList] = useState(mockTrainingSuggestions);
  
  // Estados de Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  
  // Edição
  const emptyForm = { topico: '', categoria: 'Geral', gatilhos: [], resposta: '', legislacao: '', status: 'ativo' };
  const [editingItem, setEditingItem] = useState(emptyForm);

  // Filtro
  const filteredKnowledge = knowledgeList.filter(item => 
    item.topico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleOpenEdit = (item = null) => {
    // Deep copy para evitar mutação direta e garantir array em gatilhos
    const itemToEdit = item 
      ? { ...item, gatilhos: [...(item.gatilhos || [])] } 
      : { ...emptyForm, gatilhos: [] };
      
    setEditingItem(itemToEdit);
    setShowPlayground(false); 
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem.id) {
      setKnowledgeList(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
    } else {
      setKnowledgeList(prev => [{ ...editingItem, id: Date.now(), confianca: 100 }, ...prev]);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza?")) setKnowledgeList(prev => prev.filter(i => i.id !== id));
  };

  const handleTrainItem = (suggestionId) => {
    const suggestion = trainingList.find(s => s.id === suggestionId);
    // Remove da lista de sugestões
    setTrainingList(prev => prev.filter(s => s.id !== suggestionId));
    // Abre modal de criação pré-preenchido
    handleOpenEdit({ 
      ...emptyForm, 
      topico: suggestion.perguntaUsuario, 
      gatilhos: [suggestion.perguntaUsuario] 
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bot className="text-sefaz-blue"/> Gestão da Inteligência Artificial
            </h1>
            <p className="text-sm text-gray-500">Curadoria, treinamento e monitoramento do Assistente Virtual.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white text-sefaz-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Visão Geral</button>
            <button onClick={() => setActiveTab('knowledge')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'knowledge' ? 'bg-white text-sefaz-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Base de Conhecimento</button>
            <button onClick={() => setActiveTab('training')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'training' ? 'bg-white text-sefaz-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Treinamento <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">{trainingList.length}</span></button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-white text-sefaz-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Settings size={16}/></button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* === TAB: DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AICard title="Total de Interações" value={aiStats.totalInteractions.toLocaleString()} subtext="Últimos 30 dias" icon={MessageSquare} colorClass="bg-blue-500 text-blue-600" />
              <AICard title="Acurácia da IA" value={`${aiStats.accuracy}%`} subtext="Respostas úteis" icon={BrainCircuit} colorClass="bg-purple-500 text-purple-600" />
              <AICard title="Taxa de Transbordo" value={`${aiStats.handoffRate}%`} subtext="Transferido para Humano" icon={User} colorClass="bg-orange-500 text-orange-600" />
              <AICard title="Tempo de Resposta" value={`${aiStats.avgResponseTime}s`} subtext="Latência Média" icon={Zap} colorClass="bg-green-500 text-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Tópicos Mais Demandados (Top 5)</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Emissão de IPVA', count: 4520, percent: 85 },
                    { label: 'Consulta de Débitos', count: 3210, percent: 65 },
                    { label: 'Parcelamento', count: 2100, percent: 45 },
                    { label: 'Nota Fiscal Avulsa', count: 1500, percent: 30 },
                    { label: 'Cadastro CACEPE', count: 800, percent: 15 },
                  ].map((topic, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{topic.label}</span>
                        <span className="text-gray-500">{topic.count} interações</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-sefaz-blue h-full" style={{ width: `${topic.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Saúde do Modelo</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-200 p-2 rounded-full text-green-700"><Activity size={20}/></div>
                      <div><p className="text-sm font-bold text-green-800">Operacional</p><p className="text-xs text-green-600">API GPT-4 Turbo Online</p></div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Feedback dos Usuários</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-green-600"><ThumbsUp size={18}/><span className="font-bold text-lg">88%</span></div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="bg-green-500 h-full" style={{width: '88%'}}></div></div>
                      <div className="flex items-center gap-2 text-red-500"><ThumbsDown size={18}/><span className="font-bold text-lg">12%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === TAB: KNOWLEDGE (BASE DE CONHECIMENTO) === */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  value={searchTerm} 
                  onChange={e=>setSearchTerm(e.target.value)} 
                  placeholder="Pesquisar na base de conhecimento..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sefaz-blue text-sm"
                />
              </div>
              <button onClick={() => handleOpenEdit()} className="bg-sefaz-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus size={16}/> Nova Regra
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredKnowledge.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-sefaz-blue transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">{item.categoria}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-2"><Gavel size={12}/> {item.legislacao}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{item.topico}</h3>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border-l-4 border-gray-300 group-hover:border-sefaz-blue transition-colors">{item.resposta}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-400 self-center">Gatilhos:</span>
                        {item.gatilhos && item.gatilhos.map((g, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{g}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4 border-l pl-4 border-gray-100">
                      <div className="text-center mb-2">
                        <div className={`radial-progress text-xs font-bold ${item.confianca > 90 ? 'text-green-600' : 'text-orange-500'}`}>{item.confianca}%</div>
                        <span className="text-[10px] text-gray-400">Confiança</span>
                      </div>
                      <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TAB: TRAINING (CURADORIA) === */}
        {activeTab === 'training' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600"><BrainCircuit size={20}/></div>
              <div>
                <h3 className="text-orange-900 font-bold text-sm">Curadoria de Intenções (Human-in-the-loop)</h3>
                <p className="text-orange-700 text-xs">Perguntas reais onde a IA teve baixa confiança. Ensine o modelo para melhorar a precisão.</p>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Input do Usuário</th>
                  <th className="px-6 py-3">Volume</th>
                  <th className="px-6 py-3">Confiança Atual</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainingList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">"{item.perguntaUsuario}"</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-bold">{item.frequencia}x</span></td>
                    <td className="px-6 py-4 text-orange-600 font-bold flex items-center gap-1"><AlertTriangle size={14}/> {item.confiancaIA}%</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleTrainItem(item.id)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-2 ml-auto">
                        <Zap size={12}/> Criar Regra
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === TAB: SETTINGS (CONFIGURAÇÕES GLOBAIS) === */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Cpu size={24} className="text-gray-400"/> Parâmetros do Modelo</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Modelo Base</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-sefaz-blue bg-blue-50 p-4 rounded-lg cursor-pointer relative">
                    <div className="absolute top-2 right-2 text-sefaz-blue"><CheckCircle size={20} fill="currentColor" className="text-white"/></div>
                    <h4 className="font-bold text-sefaz-blue">GPT-4 Turbo</h4>
                    <p className="text-xs text-blue-700 mt-1">Maior precisão e raciocínio complexo. Recomendado.</p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg cursor-pointer hover:border-gray-300 opacity-60">
                    <h4 className="font-bold text-gray-600">GPT-3.5 Turbo</h4>
                    <p className="text-xs text-gray-500 mt-1">Mais rápido e econômico, menor precisão.</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">Temperatura (Criatividade)</label>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">0.2 (Preciso)</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sefaz-blue"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0.0 (Robótico)</span><span>1.0 (Criativo)</span></div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tom de Voz do Assistente</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue">
                  <option>Formal e Técnico (Padrão SEFAZ)</option>
                  <option>Didático e Simples</option>
                  <option>Direto e Objetivo</option>
                </select>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button className="px-6 py-3 bg-sefaz-blue text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2">
                  <Save size={18}/> Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL DE EDIÇÃO + PLAYGROUND (ESTABILIZADO) ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl flex overflow-hidden w-full max-w-6xl max-h-[90vh]">
            
            {/* Coluna Esquerda: Formulário */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
              <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">{editingItem.id ? 'Editar Regra' : 'Nova Regra de Conhecimento'}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setShowPlayground(!showPlayground)} className={`px-3 py-1.5 text-xs font-bold rounded border flex items-center gap-2 transition-colors ${showPlayground ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    <Play size={14}/> {showPlayground ? 'Ocultar Teste' : 'Testar Regra'}
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tópico Principal</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-all" value={editingItem.topico} onChange={(e) => setEditingItem({...editingItem, topico: e.target.value})} placeholder="Ex: Isenção IPVA" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoria</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-all" value={editingItem.categoria} onChange={(e) => setEditingItem({...editingItem, categoria: e.target.value})}>
                      <option>Geral</option><option>ICMS</option><option>IPVA</option><option>NFe</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Frases Gatilho (Keywords)</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[45px] focus-within:ring-2 focus-within:ring-sefaz-blue">
                    {editingItem.gatilhos && editingItem.gatilhos.map((g, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                        {g} <button onClick={() => setEditingItem({...editingItem, gatilhos: editingItem.gatilhos.filter((_, idx) => idx !== i)})} className="ml-1 hover:text-red-500"><X size={10}/></button>
                      </span>
                    ))}
                    <input 
                      className="flex-1 outline-none text-sm min-w-[100px]" 
                      placeholder="Digite e tecle Enter..." 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setEditingItem({...editingItem, gatilhos: [...(editingItem.gatilhos || []), e.target.value]}); e.target.value = ''; }}}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Resposta da IA</label>
                  <textarea className="w-full p-3 border border-blue-200 rounded-lg text-sm bg-blue-50/50 focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue h-32" value={editingItem.resposta} onChange={(e) => setEditingItem({...editingItem, resposta: e.target.value})} placeholder="Digite a resposta padrão..."></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Base Legal / Fonte</label>
                  <div className="relative">
                    <Gavel className="absolute top-2.5 left-3 w-4 h-4 text-gray-400"/>
                    <input type="text" className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue" value={editingItem.legislacao} onChange={(e) => setEditingItem({...editingItem, legislacao: e.target.value})} placeholder="Ex: Lei 15.730/2016" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white text-sm font-bold">Cancelar</button>
                <button onClick={handleSave} className="px-6 py-2 bg-sefaz-blue text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-bold shadow-sm"><Save className="w-4 h-4 mr-2"/> Salvar Regra</button>
              </div>
            </div>

            {/* Coluna Direita: Playground (Condicional e Estável) */}
            {showPlayground && <TestPlayground rule={editingItem} onClose={() => setShowPlayground(false)} />}
            
          </div>
        </div>
      )}
    </div>
  );
}