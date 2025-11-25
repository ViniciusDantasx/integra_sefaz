import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, User, Building2, AlertTriangle, CheckCircle, XCircle, 
  FileText, DollarSign, Calendar, Truck, Printer, 
  ChevronRight, Clock, Phone, Mail, Briefcase, Download, 
  ExternalLink, RefreshCw, Shield, AlertOctagon, Copy,
  History, ArrowLeft, MessageSquare, X, Send, Minimize2,
  Voicemail, Share2, Loader2, CreditCard, LayoutDashboard,
  MapPin, MoreHorizontal, ArrowUpRight, StickyNote, Trash2, Maximize2, Calculator, Check, Save,
  Zap, FileSearch, FileClock, FileCheck
} from 'lucide-react';

// ==================================================================================
// 1. DADOS MOCKADOS (TEMPLATES DE SEGURANÇA)
// ==================================================================================

const mockPF = {
  type: 'PF',
  nome: 'NOME DO CIDADÃO',
  docPrincipal: '000.000.000-00',
  rg: '1.234.567 SDS/PE',
  nascimento: '15/05/1985',
  statusGeral: 'regular',
  domicilio: 'RECIFE - PE',
  endereco: { logradouro: 'Av. Boa Viagem', numero: '1000', complemento: 'Apt 501', bairro: 'Boa Viagem', cep: '51000-000', cidade: 'Recife', uf: 'PE' },
  contato: { email: 'cidadao@email.com', tel: '(81) 99999-9999', celular: '(81) 99999-8888' },
  are: 'ARE RECIFE - SUL',
  beneficios: [],
  resumo: { debitosQtd: 0, debitosValor: 'R$ 0,00', notificacoes: 0, dataUltimaNotificacao: '-', parcelamentos: 0 },
  debitos: [],
  pagamentos: [ { data: '10/02/2024', tributo: 'IPVA', referencia: '2024', valor: '1.750,00', forma: 'Pix', status: 'Compensado' } ],
  parcelamentos: [],
  veiculos: [ 
    { placa: 'KJG-1234', renavam: '123456789', modelo: 'HONDA CIVIC 2020', situacaoIpva: 'Vencido', status: 'Bloqueio CRLV' }, 
    { placa: 'PCC-9876', renavam: '987654321', modelo: 'FIAT TORO 2022', situacaoIpva: 'Regular', status: 'Liberado' } 
  ],
  historico: [
    { id: 101, data: '20/11/2025', canal: 'WhatsApp', protocolo: '20250001', assunto: 'Consulta IPVA', status: 'Resolvido', atendente: 'Ana Silva' },
    { id: 102, data: '15/08/2025', canal: 'Telefone', protocolo: '20259999', assunto: 'Dúvida Isenção PCD', status: 'Encaminhado', atendente: 'Roberto Santos' }
  ],
  alertas: []
};

const mockPJ = {
  type: 'PJ',
  nome: 'EMPRESA EXEMPLO LTDA',
  docPrincipal: '00.000.000/0001-00',
  ie: '0123456-78',
  situacaoCadastral: 'Ativa',
  regime: 'Normal (Débito/Crédito)',
  cnae: '4711-3/02 - Comércio Varejista',
  statusGeral: 'regular',
  domicilio: 'CARUARU - PE',
  endereco: { logradouro: 'Distrito Industrial', numero: 'S/N', complemento: 'Galpão B', bairro: 'Industrial', cep: '55000-000', cidade: 'Caruaru', uf: 'PE' },
  contato: { email: 'contato@empresa.com.br', tel: '(81) 3000-0000', celular: '(81) 99988-7766' },
  are: 'ARE CARUARU',
  resumo: { debitosQtd: 0, debitosValor: 'R$ 0,00', notificacoes: 0, dataUltimaNotificacao: '-', parcelamentos: 0, obrigacoesAcessorias: 'Em dia' },
  debitos: [],
  pagamentos: [ { data: '15/11/2025', tributo: 'ICMS Normal', referencia: '10/2025', valor: '15.400,00', forma: 'DAE', status: 'Compensado' } ],
  parcelamentos: [],
  notasFiscais: { emitidas: 1450, canceladas: 12, nfce: 3200 },
  historico: [
    { id: 201, data: '01/11/2025', canal: 'Web', protocolo: '20258888', assunto: 'Erro no SEF', status: 'Resolvido', atendente: 'Vinicius Dantas' }
  ],
  alertas: []
};

const recentSearchesMock = [
  { id: 1, nome: 'PEDRO THIAGO DA SILVA', doc: '123.456.789-00', tipo: 'PF', time: 'Há 15 min' },
  { id: 2, nome: 'COMERCIAL SILVIO VICENTE', doc: '12.345.678/0001-99', tipo: 'PJ', time: 'Há 2 horas' },
  { id: 3, nome: 'MARIANA COSTA', doc: '777.888.999-00', tipo: 'PF', time: 'Ontem' },
];

// ==================================================================================
// 2. COMPONENTES AUXILIARES DE UI
// ==================================================================================

const Badge = ({ type, text }) => {
  const styles = {
    red: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
    green: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
    yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
    gray: 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.gray}`}>{text}</span>;
};

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-2 rounded-lg ${colorClass}`}>
      <Icon size={20} />
    </div>
  </div>
);

// === MODAIS DE AÇÃO RÁPIDA (DAE, NFe, Processo) ===

// 1. Modal DAE Avulso
const QuickDaeModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        codigo: '85800000000 00000000000 00000000000 00000000000',
        valor: '150,00',
        vencimento: new Date().toLocaleDateString('pt-BR')
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><FileText size={20}/> DAE Avulso</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500">Código de Receita</label><select className="w-full border rounded-lg p-2 text-sm"><option>101 - ICMS Normal</option><option>005 - IPVA</option></select></div>
              <div><label className="text-xs font-bold text-gray-500">CPF/CNPJ do Contribuinte</label><input required type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="000.000.000-00"/></div>
              <div><label className="text-xs font-bold text-gray-500">Valor (R$)</label><input required type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="0,00"/></div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-blue-700 flex justify-center">{loading ? <Loader2 className="animate-spin"/> : 'Gerar Guia'}</button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100"><CheckCircle className="mx-auto text-green-600 mb-2"/><h4 className="font-bold text-green-800">DAE Gerado!</h4><p className="text-sm">Vencimento: {result.vencimento}</p></div>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">{result.codigo}</div>
              <button onClick={onClose} className="w-full border border-gray-300 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Modal Validador NFe
const QuickNfeModal = ({ onClose }) => {
  const [status, setStatus] = useState('idle'); 
  const [key, setKey] = useState('');

  const handleValidate = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('result'), 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in duration-200">
        <div className="bg-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Zap size={20}/> Validador NFe</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6">
          {status !== 'result' ? (
            <form onSubmit={handleValidate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">Chave de Acesso (44 dígitos)</label>
                <input value={key} onChange={e=>setKey(e.target.value)} required className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"/>
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-purple-700 flex justify-center">{status === 'loading' ? <Loader2 className="animate-spin"/> : 'Consultar Status'}</button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <FileCheck className="text-green-600 w-8 h-8"/>
                <div><h4 className="font-bold text-green-800">Autorizada</h4><p className="text-xs text-green-600">Protocolo: 1324567890001</p></div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between border-b pb-1"><span>Emitente:</span> <span className="font-bold">EMPRESA X LTDA</span></div>
                <div className="flex justify-between border-b pb-1"><span>Valor Total:</span> <span className="font-bold">R$ 1.540,00</span></div>
                <div className="flex justify-between pb-1"><span>Data Emissão:</span> <span>{new Date().toLocaleDateString()}</span></div>
              </div>
              <button onClick={() => setStatus('idle')} className="w-full bg-gray-100 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Nova Consulta</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Modal Consultar Processo (SUBSTITUTO DE INDICADORES)
const QuickProcessModal = ({ onClose }) => {
  const [status, setStatus] = useState('idle'); 
  const [protocol, setProtocol] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('result'), 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in duration-200">
        <div className="bg-orange-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><FileClock size={20}/> Consultar Processo</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6">
          {status !== 'result' ? (
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">Número do Protocolo</label>
                <input value={protocol} onChange={e=>setProtocol(e.target.value)} required className="w-full border rounded-lg p-2 text-sm font-mono" placeholder="Ex: 2025.000.12345"/>
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-orange-700 flex justify-center">{status === 'loading' ? <Loader2 className="animate-spin"/> : 'Rastrear'}</button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-orange-800 text-lg">Em Análise</h4>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200">Há 2 dias</span>
                </div>
                <div className="text-sm text-orange-700 space-y-1">
                  <p><strong>Setor:</strong> Gerência de IPVA</p>
                  <p><strong>Responsável:</strong> Roberto Santos</p>
                  <p><strong>Previsão:</strong> 10/12/2025</p>
                </div>
              </div>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-4 text-sm">
                <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"></div><p className="font-bold text-gray-800">Análise Técnica Iniciada</p><p className="text-xs text-gray-500">Ontem, 10:00</p></div>
                <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div><p className="font-bold text-gray-800">Protocolo Recebido</p><p className="text-xs text-gray-500">20/11/2025</p></div>
              </div>
              <button onClick={() => setStatus('idle')} className="w-full bg-gray-100 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Nova Consulta</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === MODAL DE GERAÇÃO DE DAE (CONTEXTUAL - MANTIDO) ===
const DaeGeneratorModal = ({ debt, onClose, onSendToChat }) => {
  const [step, setStep] = useState('loading'); 
  const [generatedData, setGeneratedData] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setGeneratedData({ numero: `81${Math.floor(Math.random() * 1000000000)}`, valor: debt?.total || '0,00', vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), linhaDigitavel: `858000000${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)}` }); setStep('success'); }, 1500); return () => clearTimeout(timer); }, [debt]);
  const handleCopy = () => { if (generatedData) { navigator.clipboard.writeText(generatedData.linhaDigitavel); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } };
  const handleSend = () => { const message = `Sr(a). Contribuinte, segue os dados para pagamento do ${debt.tributo}:\n\nValor: R$ ${generatedData.valor}\nVencimento: ${generatedData.vencimento}\nLinha Digitável: ${generatedData.linhaDigitavel}\n\nO pagamento pode ser feito via Internet Banking ou Pix.`; onSendToChat(message); onClose(); };
  return ( <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"> <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200"> <div className="bg-sefaz-blue text-white p-4 flex justify-between items-center"> <h3 className="font-bold flex items-center"><FileText className="mr-2" size={20} /> Emissão de DAE</h3> <button onClick={onClose} className="hover:text-red-200"><X size={20} /></button> </div> <div className="p-6"> {step === 'loading' && ( <div className="text-center py-8"><Loader2 className="w-12 h-12 text-sefaz-blue animate-spin mx-auto mb-4" /><p className="text-gray-600 font-medium">Consultando base de cálculo...</p></div> )} {step === 'success' && ( <div className="space-y-4"> <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"> <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-2"><CheckCircle className="text-green-600" size={24} /></div> <h4 className="text-green-800 font-bold">Guia Gerada com Sucesso!</h4> <p className="text-xs text-green-600">DAE Nº {generatedData.numero}</p> </div> <div className="grid grid-cols-2 gap-4"> <div className="p-3 bg-gray-50 rounded border"><p className="text-xs text-gray-500">Valor Total</p><p className="font-bold text-lg text-gray-800">R$ {generatedData.valor}</p></div> <div className="p-3 bg-gray-50 rounded border"><p className="text-xs text-gray-500">Vencimento</p><p className="font-bold text-lg text-red-600">{generatedData.vencimento}</p></div> </div> <div className="p-3 bg-gray-100 rounded border border-gray-300 break-all font-mono text-xs text-center">{generatedData.linhaDigitavel}</div> <div className="grid grid-cols-2 gap-3 pt-2"> <button onClick={handleCopy} className={`flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${copySuccess ? 'bg-green-100 text-green-700 border-green-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{copySuccess ? <CheckCircle size={16} className="mr-2"/> : <Copy size={16} className="mr-2"/>}{copySuccess ? 'Copiado!' : 'Copiar Código'}</button> <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"><Download size={16} className="mr-2" /> PDF</button> </div> <button onClick={handleSend} className="w-full flex items-center justify-center px-4 py-3 bg-sefaz-blue text-white rounded-lg hover:bg-sefaz-blue-dark font-bold shadow-sm mt-2"><Share2 size={18} className="mr-2" /> Enviar para o Chat</button> </div> )} </div> </div> </div> );
};

const ParcelamentoModal = ({ debt, onClose, onSendToChat }) => {
  const [loading, setLoading] = useState(false); const [selectedPlan, setSelectedPlan] = useState(null); const [customQtd, setCustomQtd] = useState(""); const debtTotal = debt?.total ? parseFloat(debt.total.replace('.','').replace(',','.')) : 0; const defaultPlans = [ { parcelas: 12, valor: (debtTotal / 12).toFixed(2), juros: '1%' }, { parcelas: 24, valor: (debtTotal / 24).toFixed(2), juros: '1.5%' }, { parcelas: 60, valor: (debtTotal / 60).toFixed(2), juros: '2%' }, ]; const handleSelect = (plan) => { setSelectedPlan(plan); setCustomQtd(""); }; const handleCustomSimulate = (e) => { e.preventDefault(); const qtd = parseInt(customQtd); if (!qtd || qtd < 2 || qtd > 60) { alert("A quantidade deve ser entre 2 e 60 parcelas."); return; } let jurosRate = '1%'; if (qtd > 12) jurosRate = '1.5%'; if (qtd > 24) jurosRate = '2%'; const simulatedPlan = { parcelas: qtd, valor: (debtTotal / qtd).toFixed(2), juros: jurosRate, isCustom: true }; setSelectedPlan(simulatedPlan); }; const handleConfirm = () => { setLoading(true); setTimeout(() => { const message = `Sr(a). Contribuinte, a simulação de parcelamento do ${debt.tributo} foi gerada com sucesso.\n\nPlano: ${selectedPlan.parcelas}x de R$ ${selectedPlan.valor} (Juros: ${selectedPlan.juros})\n\nPara efetivar, acesse o link seguro e assine o Termo de Confissão de Dívida: https://sefaz.pe.gov.br/termo/${Math.floor(Math.random()*10000)}`; onSendToChat(message); onClose(); }, 1500); };
  return ( <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"> <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200"> <div className="bg-orange-600 text-white p-4 flex justify-between items-center"> <h3 className="font-bold flex items-center"><CreditCard className="mr-2" size={20} /> Simulação de Parcelamento</h3> <button onClick={onClose} className="hover:text-orange-200"><X size={20} /></button> </div> <div className="p-6 max-h-[80vh] overflow-y-auto"> {loading ? ( <div className="text-center py-8"><Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" /><p className="text-gray-600">Gerando termo de confissão...</p></div> ) : ( <> <div className="mb-4 bg-orange-50 border border-orange-200 p-3 rounded text-sm text-orange-800 flex justify-between items-center"> <span><strong>Dívida:</strong> {debt?.tributo}</span> <span className="font-bold text-lg">R$ {debt?.total}</span> </div> <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Sugestões do Sistema:</h4> <div className="space-y-3 mb-6"> {defaultPlans.map((plan, idx) => { const isSelected = selectedPlan && selectedPlan.parcelas === plan.parcelas && !selectedPlan.isCustom; return ( <div key={idx} onClick={() => handleSelect(plan)} className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all relative ${isSelected ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'}`}> {isSelected && <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-0.5"><Check size={12}/></div>} <div><span className="font-bold text-lg text-gray-800">{plan.parcelas}x</span> <span className="text-gray-500 text-sm">mensais</span></div> <div className="text-right"><p className="font-bold text-lg text-gray-800">R$ {plan.valor}</p><p className="text-xs text-gray-400">Juros: {plan.juros}</p></div> </div> ); })} </div> <div className="border-t border-gray-200 pt-4 mb-4"> <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2"><Calculator size={14}/> Simulação Personalizada</h4> <div className="flex gap-2"> <input type="number" placeholder="Qtd. Parcelas (2-60)" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" min="2" max="60" value={customQtd} onChange={(e) => setCustomQtd(e.target.value)} /> <button onClick={handleCustomSimulate} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Simular</button> </div> {selectedPlan && selectedPlan.isCustom && ( <div className="mt-3 p-4 border border-orange-500 bg-orange-50 ring-2 ring-orange-500 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2"> <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-0.5"><Check size={12}/></div> <div><span className="font-bold text-lg text-gray-800">{selectedPlan.parcelas}x</span> <span className="text-gray-500 text-sm">Personalizado</span></div> <div className="text-right"><p className="font-bold text-lg text-gray-800">R$ {selectedPlan.valor}</p><p className="text-xs text-gray-400">Juros: {selectedPlan.juros}</p></div> </div> )} </div> <button onClick={handleConfirm} disabled={!selectedPlan} className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">Gerar Termo e Enviar</button> </> )} </div> </div> </div> );
};

// === MINI CHAT FLUTUANTE (MANTIDO) ===
const MiniChat = ({ messages, onSendMessage, title, onClose }) => {
  const [input, setInput] = useState(""); const [isMinimized, setIsMinimized] = useState(false); const endRef = useRef(null); useEffect(() => endRef.current?.scrollIntoView(), [messages, isMinimized]); const handleSend = () => { if (!input.trim()) return; onSendMessage(input); setInput(""); }; if (isMinimized) { return ( <div className="fixed bottom-6 right-6 bg-sefaz-blue bg-blue-600 text-white p-3 rounded-full shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-blue-700 z-[100] transition-all transform hover:scale-105 border-2 border-white" onClick={() => setIsMinimized(false)} title="Expandir Chat"> <MessageSquare size={24} /> <span className="font-bold text-sm pr-2">Chat em Andamento</span> <Maximize2 size={14} className="opacity-70" /> </div> ); } return ( <div className="fixed bottom-4 right-4 w-80 bg-white rounded-t-xl shadow-2xl border border-gray-300 flex flex-col z-[100] h-[450px] animate-in slide-in-from-bottom-10 fade-in duration-300"> <div className="bg-sefaz-blue bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center cursor-pointer hover:bg-blue-700 transition-colors" onClick={() => setIsMinimized(true)}> <div className="flex items-center gap-2 overflow-hidden"> <MessageSquare size={18} /> <div className="flex flex-col"> <span className="font-bold text-sm truncate max-w-[150px]">{title}</span> <span className="text-[10px] text-blue-100">Em atendimento</span> </div> </div> <div className="flex gap-2 items-center"> <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="hover:text-blue-200 p-1" title="Minimizar"><Minimize2 size={16} /></button> <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:text-red-300 p-1" title="Fechar"><X size={16} /></button> </div> </div> <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-300"> {messages.map((m, i) => ( <div key={i} className={`flex ${m.sender==='user'?'justify-end':'justify-start'}`}> {m.sender === 'sys' ? ( <div className="w-full text-center text-[10px] text-gray-400 italic my-1">{m.text}</div> ) : ( <div className={`p-2 rounded-lg max-w-[85%] shadow-sm ${m.sender==='user'?'bg-green-100 text-gray-800 rounded-tr-none':'bg-white border text-gray-700 rounded-tl-none'}`}> {m.text} </div> )} </div> ))} <div ref={endRef} /> </div> <div className="p-2 border-t bg-white flex gap-2"> <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Responder..." autoFocus /> <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"><Send size={18}/></button> </div> </div> );
};

// ==================================================================================
// 3. LAYOUT PRINCIPAL
// ==================================================================================

export default function TaxpayerConsolePage({ initialData, onBack, currentSlaTime }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('visao_geral');
  const [currentData, setCurrentData] = useState(null); 
  const [loading, setLoading] = useState(false);
  
  // Estados de Modais Globais
  const [activeGlobalModal, setActiveGlobalModal] = useState(null); // 'dae', 'nfe', 'process'

  // Chat & Actions State
  const [chatMessages, setChatMessages] = useState([]);
  const [isMiniChatVisible, setIsMiniChatVisible] = useState(false);
  const [selectedDebtForDae, setSelectedDebtForDae] = useState(null);
  const [selectedDebtForParcel, setSelectedDebtForParcel] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Estado para Notas Internas e Form
  const [noteInput, setNoteInput] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setLoading(true);
      setTimeout(() => {
        let baseTemplate = initialData.type === 'PJ' ? JSON.parse(JSON.stringify(mockPJ)) : JSON.parse(JSON.stringify(mockPF));
        const mergedData = { 
          ...baseTemplate, 
          nome: initialData.nome?.toUpperCase(), 
          docPrincipal: initialData.docPrincipal, 
          contato: { 
            ...baseTemplate.contato, 
            email: initialData.contato?.email || baseTemplate.contato.email, 
            tel: initialData.contato?.tel || baseTemplate.contato.tel 
          }, 
          statusGeral: initialData.statusGeral || baseTemplate.statusGeral 
        };

        if ((mergedData.statusGeral === 'irregular' || mergedData.statusGeral === 'pendente') && mergedData.debitos.length === 0) {
          const fakeDebt = { id: 99, tributo: initialData.type === 'PJ' ? 'ICMS Antecipado' : 'IPVA 2024', periodo: '2024', principal: '500,00', encargos: '50,00', total: '550,00', status: 'Pendente', cor: 'red', acaoSugerida: 'Verificar' };
          mergedData.debitos = [fakeDebt];
          mergedData.resumo.debitosQtd = 1;
          mergedData.resumo.debitosValor = 'R$ 550,00';
          
          if (mergedData.statusGeral === 'pendente') {
             mergedData.alertas.push({ id: 99, texto: 'Pendência Cadastral identificada na triagem.', acao: 'Orientar', criticalidade: 'media' });
          } else {
             mergedData.alertas.push({ id: 98, texto: 'Débito impeditivo de CND.', acao: 'Regularizar', criticalidade: 'alta' });
          }
        } else if (mergedData.statusGeral === 'regular') {
          mergedData.debitos = [];
          mergedData.resumo = { ...mergedData.resumo, debitosQtd: 0, debitosValor: 'R$ 0,00' };
        }

        setCurrentData(mergedData);
        setFormData({
          nome: mergedData.nome,
          docPrincipal: mergedData.docPrincipal,
          email: mergedData.contato?.email,
          tel: mergedData.contato?.tel,
          celular: mergedData.contato?.celular,
          logradouro: mergedData.endereco?.logradouro,
          numero: mergedData.endereco?.numero,
          complemento: mergedData.endereco?.complemento,
          bairro: mergedData.endereco?.bairro,
          cidade: mergedData.endereco?.cidade,
          uf: mergedData.endereco?.uf,
          cep: mergedData.endereco?.cep
        });

        setSearchTerm(initialData.docPrincipal);
        if (initialData.messageLog) { setChatMessages(initialData.messageLog); setIsMiniChatVisible(true); }
        setActiveTab('visao_geral');
        setLoading(false);
      }, 600);
    }
  }, [initialData]);

  const handleBack = () => initialData ? onBack({ ...initialData, messageLog: chatMessages }) : onBack();
  const formatTime = (s) => `${Math.floor((s||0)/60).toString().padStart(2,'0')}:${((s||0)%60).toString().padStart(2,'0')}`;
  const handleAddToChat = (msg) => { 
    if (initialData) {
      const message = typeof msg === 'string' ? { sender: 'atendente', text: msg } : msg; 
      setChatMessages(p => [...p, message]); 
      setIsMiniChatVisible(true);
    } else {
      handleShowToast("Chat indisponível no modo de consulta avulsa.");
    }
  };
  const handleShowToast = (msg) => { setToastMessage(msg); setTimeout(()=>setToastMessage(null), 3000); };
  
  const handleQuickAction = (actionName) => {
    handleShowToast(`Solicitando: ${actionName}...`);
    setTimeout(() => {
      if (initialData) {
        handleAddToChat({ sender: 'sys', text: `Solicitação de ${actionName} processada com sucesso pelo atendente.` });
      }
      handleShowToast(`${actionName} gerado com sucesso!`);
    }, 1500);
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    const newNote = { id: Date.now(), text: noteInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setSavedNotes([newNote, ...savedNotes]);
    setNoteInput("");
    handleShowToast("Nota interna adicionada.");
  };

  const handleDeleteNote = (id) => { setSavedNotes(prev => prev.filter(n => n.id !== id)); };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setTimeout(() => { 
      if (searchTerm.includes('00')) setCurrentData(mockPJ); else setCurrentData(mockPF);
      setLoading(false); setActiveTab('visao_geral'); setChatMessages([]); setSavedNotes([]);
    }, 800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCadastro = () => {
    handleShowToast("Dados cadastrais atualizados com sucesso.");
  };

  const handleDetailPendencies = () => { setActiveTab('debitos'); };

  // Funções de Estilo Condicional
  const getHeaderGradient = (status) => {
    if (status === 'regular') return 'bg-gradient-to-r from-green-700 to-green-600';
    if (status === 'pendente') return 'bg-gradient-to-r from-orange-600 to-orange-500'; 
    return 'bg-gradient-to-r from-red-700 to-red-600'; 
  };

  const getSidePanelClass = (status) => {
    if (status === 'regular') return 'bg-green-50 border-green-200';
    if (status === 'pendente') return 'bg-orange-50 border-orange-200 text-orange-800';
    return 'bg-red-50 border-red-200 text-red-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'regular') return <CheckCircle size={24}/>;
    if (status === 'pendente') return <AlertTriangle size={24}/>;
    return <AlertOctagon size={24}/>;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden font-sans">
      
      {/* === MODAIS GLOBAIS === */}
      {activeGlobalModal === 'dae' && <QuickDaeModal onClose={() => setActiveGlobalModal(null)} />}
      {activeGlobalModal === 'nfe' && <QuickNfeModal onClose={() => setActiveGlobalModal(null)} />}
      {activeGlobalModal === 'process' && <QuickProcessModal onClose={() => setActiveGlobalModal(null)} />}

      {/* === MODAIS CONTEXTUAIS === */}
      {selectedDebtForDae && <DaeGeneratorModal debt={selectedDebtForDae} onClose={() => setSelectedDebtForDae(null)} onSendToChat={handleAddToChat} />}
      {selectedDebtForParcel && <ParcelamentoModal debt={selectedDebtForParcel} onClose={() => setSelectedDebtForParcel(null)} onSendToChat={handleAddToChat} />}
      
      {toastMessage && <div className="fixed top-4 right-1/2 translate-x-1/2 z-[160] bg-gray-900 text-white px-6 py-2 rounded-full shadow-lg flex items-center text-sm animate-in slide-in-from-top-5"><CheckCircle size={14} className="mr-2 text-green-400"/> {toastMessage}</div>}

      <header className="bg-white border-b h-16 flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><ArrowLeft size={20}/></button>
          <div><h1 className="text-lg font-bold text-gray-800 leading-tight">Console Fiscal</h1><p className="text-xs text-gray-400">{initialData ? 'Atendimento ao Contribuinte' : 'Consulta Administrativa'}</p></div>
        </div>
        
        {/* Barra de Busca do Header (SÓ APARECE SE JÁ TIVER DADOS) */}
        {currentData && (
          <div className="flex-1 max-w-xl mx-8 animate-in fade-in zoom-in duration-300">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sefaz-blue" size={18}/>
              <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Nova busca (CPF/CNPJ)..." className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-sefaz-blue focus:ring-0 rounded-lg pl-10 pr-4 py-2 text-sm transition-all border"/>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* LÓGICA DE SLA CORRIGIDA */}
          {initialData ? (
            <div className="px-3 py-1 bg-blue-50 text-sefaz-blue rounded-full text-sm font-medium flex items-center gap-2"><Clock size={14}/> {formatTime(currentSlaTime)}</div>
          ) : (
            <div className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm font-medium flex items-center gap-2"><Calendar size={14}/> {new Date().toLocaleDateString()}</div>
          )}
          <div className="w-8 h-8 bg-sefaz-blue rounded-full text-white flex items-center justify-center font-bold text-xs">VD</div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {!currentData && !loading ? (
          // === DASHBOARD INICIAL (ESTADO VAZIO RICO E FUNCIONAL) ===
          <div className="flex-1 flex flex-col items-center justify-start pt-20 bg-gray-50 overflow-y-auto">
            <div className="w-full max-w-3xl px-6 text-center">
              <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search size={40} className="text-sefaz-blue"/>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Console Fiscal Unificado</h2>
              <p className="text-gray-500 mb-8">Realize consultas detalhadas, emita documentos e verifique a situação fiscal de contribuintes.</p>
              
              <form onSubmit={handleSearch} className="relative mb-12 shadow-md rounded-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24}/>
                <input 
                  value={searchTerm} 
                  onChange={e=>setSearchTerm(e.target.value)} 
                  placeholder="Digite CPF, CNPJ, Placa ou Número do Processo..." 
                  className="w-full h-14 pl-14 pr-4 rounded-xl border-gray-200 text-lg focus:ring-2 focus:ring-sefaz-blue focus:border-sefaz-blue transition-all"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-sefaz-blue text-white px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors">Consultar</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
                <button onClick={() => setActiveGlobalModal('dae')} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group text-left">
                  <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 text-blue-600"><FileSearch size={20}/></div>
                  <h4 className="font-bold text-gray-800">Emitir DAE Avulso</h4>
                  <p className="text-xs text-gray-500 mt-1">Geração rápida sem cadastro completo.</p>
                </button>
                <button onClick={() => setActiveGlobalModal('nfe')} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group text-left">
                  <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-100 text-purple-600"><Zap size={20}/></div>
                  <h4 className="font-bold text-gray-800">Validar NFe</h4>
                  <p className="text-xs text-gray-500 mt-1">Consulta por chave de acesso.</p>
                </button>
                <button onClick={() => setActiveGlobalModal('process')} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group text-left">
                  <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-100 text-orange-600"><FileClock size={20}/></div>
                  <h4 className="font-bold text-gray-800">Consultar Processo</h4>
                  <p className="text-xs text-gray-500 mt-1">Rastreamento de protocolos.</p>
                </button>
              </div>

              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Consultas Recentes</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {recentSearchesMock.map((item) => (
                    <div key={item.id} onClick={() => { setSearchTerm(item.doc); handleSearch({ preventDefault: ()=>{} }); }} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">{item.tipo}</div>
                        <div><p className="font-bold text-gray-800 text-sm">{item.nome}</p><p className="text-xs text-gray-500 font-mono">{item.doc}</p></div>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-sefaz-blue" size={40}/></div>
        ) : (
          // === ÁREA DE CONTEÚDO (QUANDO HÁ DADOS) ===
          <div className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-y-auto">
            <div className={`w-full px-8 py-6 pb-12 ${getHeaderGradient(currentData.statusGeral)} text-white shadow-md`}>
              <div className="max-w-7xl mx-auto flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white border border-white/30">{currentData.type === 'PJ' ? <Building2 size={32}/> : <User size={32}/>}</div>
                  <div><div className="flex items-center gap-2 mb-1"><span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white/90">{currentData.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</span><span className="flex items-center gap-1 text-xs text-white/80"><MapPin size={12}/> {currentData.domicilio}</span></div><h2 className="text-2xl font-bold leading-tight">{currentData.nome}</h2><p className="font-mono opacity-80 mt-1 flex items-center gap-2">{currentData.docPrincipal} <span className="w-1 h-1 bg-white rounded-full opacity-50"></span> {currentData.contato?.email}</p></div>
                </div>
                <div className="text-right"><div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md"><p className="text-xs uppercase tracking-wide opacity-80 mb-1">Situação Cadastral</p><div className="flex items-center justify-end gap-2 text-xl font-bold">{getStatusIcon(currentData.statusGeral)}<span className="capitalize">{currentData.statusGeral}</span></div></div></div>
              </div>
            </div>

            <div className="flex-1 px-8 -mt-8 pb-10 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Dívida Total" value={currentData.resumo?.debitosValor || 'R$ 0,00'} icon={DollarSign} colorClass="bg-red-50 text-red-600" />
                <StatCard label="Notificações" value={currentData.resumo?.notificacoes || 0} icon={Mail} colorClass="bg-orange-50 text-orange-600" />
                <StatCard label="Último Pagto" value={currentData.pagamentos?.[0]?.data || '-'} icon={Calendar} colorClass="bg-blue-50 text-blue-600" />
                <StatCard label="Compliance" value="98/100" icon={Shield} colorClass="bg-green-50 text-green-600" />
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-2">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                      {[{ id: 'visao_geral', label: 'Visão Geral', icon: LayoutDashboard }, { id: 'debitos', label: 'Débitos e Pendências', icon: AlertTriangle }, { id: 'pagamentos', label: 'Pagamentos', icon: CheckCircle }, { id: 'historico', label: 'Histórico', icon: History }, { id: 'cadastro', label: 'Dados Cadastrais', icon: FileText }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-sefaz-blue text-sefaz-blue' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}><tab.icon size={16} className={activeTab === tab.id ? 'text-sefaz-blue' : 'text-gray-400'}/>{tab.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* ABA: VISÃO GERAL */}
                    {activeTab === 'visao_geral' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between"><h3 className="font-bold text-gray-800 text-lg">Resumo de Atividades</h3><button onClick={()=>setActiveTab('historico')} className="text-sm text-sefaz-blue hover:underline">Ver histórico completo</button></div>
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                          <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div><p className="text-sm font-bold text-gray-800">Atendimento Iniciado</p><p className="text-xs text-gray-500">Hoje, 14:30 • Via Console do Atendente</p></div>
                          {currentData.resumo?.notificacoes > 0 && ( <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"></div><p className="text-sm font-bold text-gray-800">Alerta de Pendência Enviado</p><p className="text-xs text-gray-500">10/11/2025 • DTE</p><div className="mt-2 bg-orange-50 border border-orange-100 p-3 rounded text-sm text-orange-800">O contribuinte possui 1 notificação não lida.</div></div> )}
                           <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div><p className="text-sm font-bold text-gray-800">Pagamento Confirmado</p><p className="text-xs text-gray-500">15/11/2025 • R$ 15.400,00 (ICMS)</p></div>
                        </div>
                        {currentData.debitos?.length > 0 && ( <div className="mt-6 pt-6 border-t"><h4 className="font-bold text-red-700 mb-3 flex items-center"><AlertTriangle size={16} className="mr-2"/> Pendências Prioritárias</h4><div className="grid grid-cols-1 gap-3">{currentData.debitos.slice(0,2).map(d => ( <div key={d.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg"><div><p className="font-bold text-gray-800">{d.tributo}</p><p className="text-xs text-gray-500">{d.periodo} • {d.total}</p></div><button onClick={() => { setActiveTab('debitos'); }} className="px-3 py-1 bg-white border border-red-200 text-red-700 text-xs font-bold rounded shadow-sm hover:bg-red-50">Resolver</button></div> ))}</div></div> )}
                      </div>
                    )}

                    {/* ABA: DÉBITOS */}
                    {activeTab === 'debitos' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-gray-800">Detalhamento de Débitos</h3><div className="flex gap-2"><button className="px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50">Exportar PDF</button><button onClick={() => handleShowToast('Lista atualizada')} className="px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50 flex items-center gap-1"><RefreshCw size={12}/> Atualizar</button></div></div>
                        {currentData.debitos?.length > 0 ? ( <div className="overflow-hidden rounded-lg border border-gray-200"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 font-medium"><tr><th className="px-4 py-3">Tributo</th><th className="px-4 py-3">Vencimento</th><th className="px-4 py-3 text-right">Valor Total</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-gray-100">{currentData.debitos.map(d => ( <tr key={d.id} className="hover:bg-gray-50 group"><td className="px-4 py-3 font-medium">{d.tributo}</td><td className="px-4 py-3 text-gray-500">{d.periodo}</td><td className="px-4 py-3 text-right font-bold text-gray-900">{d.total}</td><td className="px-4 py-3 text-center"><Badge type={d.cor} text={d.status}/></td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => setSelectedDebtForDae(d)} className="px-3 py-1 bg-sefaz-blue bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">DAE</button><button onClick={() => setSelectedDebtForParcel(d)} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors">Parcelar</button></div></td></tr> ))}</tbody></table></div> ) : ( <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"><CheckCircle size={48} className="mx-auto text-green-500 mb-3 opacity-50"/><p className="text-gray-500 font-medium">Nenhum débito em aberto.</p></div> )}
                      </div>
                    )}

                    {/* ABA: PAGAMENTOS */}
                    {activeTab === 'pagamentos' && ( <div><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">Histórico de Pagamentos</h3><button className="px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50">Filtrar por Período</button></div><div className="overflow-hidden rounded-lg border border-gray-200"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 font-medium"><tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Tributo</th><th className="px-4 py-3">Ref.</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Forma</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 text-center">Comp.</th></tr></thead><tbody className="divide-y divide-gray-100">{currentData.pagamentos?.map((p,i)=><tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-900">{p.data}</td><td className="px-4 py-3">{p.tributo}</td><td className="px-4 py-3 text-gray-500">{p.referencia}</td><td className="px-4 py-3 font-medium">{p.valor}</td><td className="px-4 py-3 text-gray-500">{p.forma}</td><td className="px-4 py-3 text-center"><Badge type="green" text={p.status}/></td><td className="px-4 py-3 text-center"><button onClick={()=>handleShowToast("Comprovante enviado ao chat")} className="text-gray-400 hover:text-blue-600"><Printer size={16}/></button></td></tr>)}</tbody></table></div></div> )}

                    {/* ABA: CADASTRO */}
                    {activeTab === 'cadastro' && (
                      <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-gray-800 text-lg">Dados Cadastrais</h3>
                          <button onClick={handleSaveCadastro} className="bg-sefaz-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-700 transition-colors"><Save size={16} className="mr-2"/> Salvar Alterações</button>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-12 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center"><User size={14} className="mr-1"/> {currentData.type === 'PJ' ? 'Dados da Empresa' : 'Dados Pessoais'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">Nome Completo / Razão Social</label><input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500" /></div>
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">{currentData.type === 'PJ' ? 'CNPJ' : 'CPF'}</label><input type="text" name="docPrincipal" value={formData.docPrincipal || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100 text-gray-500 cursor-not-allowed" readOnly /></div>
                              {currentData.type === 'PJ' ? ( <div><label className="block text-xs font-medium text-gray-700 mb-1">Inscrição Estadual</label><input type="text" value={currentData.ie || ''} className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100" readOnly /></div> ) : ( <div><label className="block text-xs font-medium text-gray-700 mb-1">RG</label><input type="text" value={mockPF.rg || ''} className="w-full p-2 border border-gray-300 rounded text-sm" /></div> )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center"><Phone size={14} className="mr-1"/> Contato</h4>
                            <div className="space-y-3">
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">E-mail Principal</label><input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                              <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Telefone Fixo</label><input type="text" name="tel" value={formData.tel || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Celular / WhatsApp</label><input type="text" name="celular" value={formData.celular || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center"><MapPin size={14} className="mr-1"/> Endereço Fiscal</h4>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="col-span-1"><label className="block text-xs font-medium text-gray-700 mb-1">CEP</label><input type="text" name="cep" value={formData.cep || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                              <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Logradouro</label><input type="text" name="logradouro" value={formData.logradouro || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">Número</label><input type="text" name="numero" value={formData.numero || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">Bairro</label><input type="text" name="bairro" value={formData.bairro || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded text-sm" /></div>
                              <div><label className="block text-xs font-medium text-gray-700 mb-1">Cidade/UF</label><input type="text" value={`${formData.cidade || ''} - ${formData.uf || ''}`} className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100" readOnly /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ABA: HISTÓRICO */}
                    {activeTab === 'historico' && (
                      <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Histórico de Interações</h3>
                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
                          {currentData.historico?.length > 0 ? currentData.historico.map((item) => (
                            <div key={item.id} className="relative pl-8">
                              <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${item.canal === 'WhatsApp' || item.canal === 'Chat' ? 'bg-green-500' : item.canal === 'Telefone' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                                {item.canal === 'WhatsApp' || item.canal === 'Chat' ? <MessageSquare size={10} className="text-white"/> : item.canal === 'Telefone' ? <Phone size={10} className="text-white"/> : <FileText size={10} className="text-white"/>}
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                  <div><span className="text-xs font-bold text-sefaz-blue uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">{item.protocolo}</span><h4 className="font-bold text-gray-800 mt-1">{item.assunto}</h4></div><span className="text-xs text-gray-500">{item.data}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100"><div className="flex items-center gap-2"><User size={14}/> {item.atendente}</div><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${item.status === 'Resolvido' || item.status === 'Concluído' ? 'bg-green-500' : 'bg-yellow-500'}`}></span> {item.status}</div></div>
                              </div>
                            </div>
                          )) : ( <div className="pl-8 text-gray-400 italic">Nenhum histórico registrado.</div> )}
                        </div>
                      </div>
                    )}

                    {(activeTab !== 'visao_geral' && activeTab !== 'debitos' && activeTab !== 'cadastro' && activeTab !== 'historico' && activeTab !== 'pagamentos') && (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400"><FileText size={48} className="mb-4 opacity-20"/><p>Conteúdo da aba <strong>{activeTab}</strong></p></div>
                    )}
                  </div>
                </div>

                {/* COLUNA LATERAL (Ações e Alertas) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                  {currentData.alertas?.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><AlertTriangle size={14}/> Alertas do Sistema</h4>
                      <div className="space-y-3">{currentData.alertas.map(a => ( <div key={a.id} className={`p-3 rounded-lg border text-sm ${a.criticalidade === 'alta' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}><p className="font-medium mb-2">{a.texto}</p><button onClick={() => { if(a.acao === 'Regularizar') setActiveTab('debitos'); else handleShowToast(`Ação: ${a.acao}`); }} className="w-full py-1.5 bg-white border border-transparent shadow-sm rounded text-xs font-bold uppercase tracking-wide hover:shadow transition-shadow">{a.acao}</button></div> ))}</div>
                    </div>
                  )}
                  <div className={`rounded-lg shadow-sm border overflow-hidden p-4 ${getSidePanelClass(currentData.statusGeral)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold text-lg flex items-center ${currentData.statusGeral === 'regular' ? 'text-green-800' : currentData.statusGeral === 'pendente' ? 'text-orange-800' : 'text-red-800'}`}>
                        {getStatusIcon(currentData.statusGeral)}
                        <span className="ml-2 capitalize">Situação {currentData.statusGeral}</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/60 p-2 rounded border border-black/5"><p className="text-xs font-semibold opacity-70">Débitos</p><p className="text-lg font-bold">{currentData.resumo?.debitosQtd}</p><p className="text-xs">{currentData.resumo?.debitosValor}</p></div>
                      <div className="bg-white/60 p-2 rounded border border-black/5"><p className="text-xs font-semibold opacity-70">Notificações</p><p className="text-lg font-bold">{currentData.resumo?.notificacoes}</p><p className="text-xs">{currentData.resumo?.dataUltimaNotificacao}</p></div>
                    </div>
                    <div className="space-y-2">
                      {currentData.statusGeral !== 'regular' && ( <button onClick={handleDetailPendencies} className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 flex justify-center items-center"><FileText size={16} className="mr-2" /> Detalhar Pendências</button> )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><ArrowUpRight size={14}/> Ações Rápidas</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleQuickAction("Emitir CND")} className="flex items-center justify-between p-2.5 rounded hover:bg-gray-50 text-sm text-gray-700 border border-transparent hover:border-gray-200 transition-colors text-left"><span className="flex items-center gap-2"><FileText size={14} className="text-gray-400"/> Emitir CND</span><ChevronRight size={14} className="text-gray-300"/></button>
                      <button onClick={() => handleQuickAction("Extrato Consolidado")} className="flex items-center justify-between p-2.5 rounded hover:bg-gray-50 text-sm text-gray-700 border border-transparent hover:border-gray-200 transition-colors text-left"><span className="flex items-center gap-2"><Download size={14} className="text-gray-400"/> Extrato Consolidado</span><ChevronRight size={14} className="text-gray-300"/></button>
                      <button onClick={() => handleQuickAction("2ª Via Boleto")} className="flex items-center justify-between p-2.5 rounded hover:bg-gray-50 text-sm text-gray-700 border border-transparent hover:border-gray-200 transition-colors text-left"><span className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> Enviar 2ª Via Boleto</span><ChevronRight size={14} className="text-gray-300"/></button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 flex flex-col">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><StickyNote size={14}/> Notas do Atendimento</h4>
                    <div className="flex-1 overflow-y-auto min-h-[100px] mb-3 space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                      {savedNotes.length === 0 && <p className="text-xs text-gray-400 italic text-center mt-4">Nenhuma nota adicionada.</p>}
                      {savedNotes.map(note => ( <div key={note.id} className="bg-yellow-50 p-2.5 rounded border border-yellow-100 text-xs text-gray-700 relative group"><div className="flex justify-between text-[10px] text-gray-400 mb-1"><span className="font-bold text-yellow-700">Você</span><span>{note.timestamp}</span></div>{note.text}<button onClick={() => handleDeleteNote(note.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"><Trash2 size={10}/></button></div> ))}
                    </div>
                    <div className="border-t pt-3"><textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} className="w-full h-16 p-2 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-sefaz-blue focus:border-sefaz-blue resize-none mb-2" placeholder="Escreva uma observação..."></textarea><button onClick={handleSaveNote} className="w-full py-1.5 bg-gray-800 text-white rounded text-xs font-bold hover:bg-gray-700">Adicionar Nota</button></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {initialData && isMiniChatVisible && ( <MiniChat messages={chatMessages} onSendMessage={handleAddToChat} title={initialData.nome} onClose={() => setIsMiniChatVisible(false)} /> )}
    </div>
  );
}