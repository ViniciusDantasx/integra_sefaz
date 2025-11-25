import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Copy, ThumbsUp, ThumbsDown, CheckCircle, 
  MessageSquare, Gavel, ChevronDown, ChevronUp, Tag, AlertCircle,
  Filter, FileText, ExternalLink, Send
} from 'lucide-react';

// ==================================================================================
// 1. DADOS MOCKADOS (Sincronizados com a Gestão de IA)
// ==================================================================================

const mockArticles = [
  { 
    id: 1, 
    categoria: 'ICMS Fronteiras', 
    titulo: 'Liberação de Mercadoria Retida (Posto Fiscal)', 
    gatilhos: ['caminhão parado', 'mercadoria retida', 'pagar fronteira', 'posto fiscal'], 
    resposta: 'Para liberação de mercadoria retida por ICMS Antecipado, o contribuinte deve emitir o DAE sob o código de receita 058-2 (ICMS Fronteiras) através do Portal GNRE ou SefazNet.\n\nA liberação no sistema ocorre automaticamente em até 1 hora após a compensação bancária. Caso persista, abrir protocolo na ARE Virtual > Liberação de Mercadorias.',
    legislacao: 'Dec. 44.650/2017 (RICMS), Arts. 320 a 325.',
    updatedAt: '10/11/2025',
    likes: 124
  },
  { 
    id: 2, 
    categoria: 'NFe', 
    titulo: 'Cancelamento Extemporâneo de NFe', 
    gatilhos: ['cancelar nota fora do prazo', 'multa cancelamento', '24 horas'], 
    resposta: 'O prazo regulamentar é de 24h. Após esse período, e até 720h (30 dias), o cancelamento é considerado extemporâneo, sujeito a multa de 1% a 5% do valor da operação.\n\nProcedimento: Fazer no software emissor ou via "Evento de Cancelamento" no portal e-Fisco.',
    legislacao: 'Lei 15.730/2016, Art. 12; Ajuste SINIEF 07/05.',
    updatedAt: '05/10/2025',
    likes: 89
  },
  { 
    id: 3, 
    categoria: 'IPVA', 
    titulo: 'Isenção de IPVA para PCD', 
    gatilhos: ['isenção deficiente', 'autismo ipva', 'não pagar ipva pcd'], 
    resposta: 'A isenção aplica-se a veículos de até R$ 70.000 (isenção total) ou até R$ 120.000 (parcial). O pedido é 100% digital via ARE Virtual.\n\nDocumentos: Laudo DETRAN/PE, CNH Especial e Nota Fiscal.',
    legislacao: 'Lei 10.849/1992, Art. 6º.',
    updatedAt: '15/01/2025',
    likes: 215
  },
  { 
    id: 4, 
    categoria: 'Cadastro', 
    titulo: 'Reativação de Inscrição Estadual (CACEPE)', 
    gatilhos: ['inscrição inapta', 'reativar cacepe', 'bloqueio sefaz'], 
    resposta: 'Se o bloqueio for por "Omissão de Destaque", transmita as SEF/eDOC omissas. A reativação é automática em 48h.\nSe for por "Endereço Inexistente", é necessário abrir alteração cadastral na JUCEPE.',
    legislacao: 'Portaria SF nº 098/2020.',
    updatedAt: '20/11/2025',
    likes: 56
  },
  {
    id: 5,
    categoria: 'ITCMD',
    titulo: 'Cálculo de Imposto sobre Doação',
    gatilhos: ['doação dinheiro', 'imposto doação', 'itcmd doação'],
    resposta: 'Para doações em dinheiro, a alíquota varia de 2% a 8% dependendo do valor. Deve ser declarado no e-Fisco -> ITCMD -> Declaração de Doação. O sistema gera o DAE automaticamente após o preenchimento.',
    legislacao: 'Lei 13.974/2009',
    updatedAt: '01/11/2025',
    likes: 34
  }
];

const categories = ['Todas', 'ICMS Fronteiras', 'NFe', 'IPVA', 'Cadastro', 'ITCMD'];

// ==================================================================================
// 2. PÁGINA PRINCIPAL
// ==================================================================================

export default function BaseConhecimentoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedId, setExpandedId] = useState(null);
  const [articles, setArticles] = useState(mockArticles);
  
  // Estado para armazenar feedback do usuário { [articleId]: 'up' | 'down' }
  const [userFeedback, setUserFeedback] = useState({});
  
  // Feedback Visual (Toast)
  const [toastMessage, setToastMessage] = useState(null);

  // Filtro Dinâmico
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.gatilhos.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          article.resposta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || article.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // === AÇÕES ===

  const handleCopy = (text, e) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(text);
    setToastMessage("Resposta copiada para a área de transferência!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFeedback = (id, type, e) => {
    e.stopPropagation();
    
    // Atualiza o estado visual do botão
    setUserFeedback(prev => ({
      ...prev,
      [id]: type
    }));

    setToastMessage(type === 'up' ? "Obrigado! Seu feedback ajuda a treinar a IA." : "Feedback enviado. A gestão irá revisar este tópico.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSuggestion = (e) => {
    e.preventDefault();
    setToastMessage("Sugestão enviada para a equipe de Gestão da IA.");
    setSearchTerm('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-1/2 translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl animate-in slide-in-from-top-5 fade-in flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20}/> {toastMessage}
        </div>
      )}

      {/* Header / Search Hero */}
      <header className="bg-white border-b border-gray-200 p-8 pb-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-3xl font-bold text-sefaz-blue mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8"/> Base de Conhecimento
          </h1>
          <p className="text-gray-500">Pesquise procedimentos, legislações e scripts de atendimento.</p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sefaz-blue transition-colors" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Como parcelar IPVA, Multa NFe, CACEPE bloqueado..." 
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-sefaz-blue focus:ring-4 focus:ring-blue-50 text-lg transition-all shadow-sm"
              autoFocus
            />
          </div>
          
          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${selectedCategory === cat 
                    ? 'bg-sefaz-blue text-white border-sefaz-blue shadow-md transform scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-sefaz-blue hover:text-sefaz-blue'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content List */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => toggleExpand(article.id)}
                className={`bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
                  ${expandedId === article.id ? 'border-sefaz-blue shadow-md ring-1 ring-blue-100' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
                `}
              >
                {/* Card Header */}
                <div className="p-5 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-sefaz-blue text-[10px] font-bold uppercase rounded border border-blue-100 tracking-wider">
                        {article.categoria}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500"/> Validado em {article.updatedAt}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold text-gray-800 group-hover:text-sefaz-blue transition-colors ${expandedId === article.id ? 'text-sefaz-blue' : ''}`}>
                      {article.titulo}
                    </h3>
                    
                    {/* Preview dos Gatilhos */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.gatilhos.map((g, i) => (
                        <span key={i} className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          <Tag size={10} className="mr-1"/> {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-gray-400 group-hover:text-sefaz-blue transition-colors">
                    {expandedId === article.id ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === article.id && (
                  <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in">
                    <div className="h-px w-full bg-gray-100 mb-4"></div>
                    
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-4 relative group/answer">
                      <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-2">
                        <MessageSquare size={14}/> Resposta Padrão (Script)
                      </h4>
                      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                        {article.resposta}
                      </p>
                      
                      <button 
                        onClick={(e) => handleCopy(article.resposta, e)}
                        className="absolute top-2 right-2 p-2 bg-white text-sefaz-blue border border-blue-200 rounded hover:bg-blue-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover/answer:opacity-100"
                        title="Copiar Texto"
                      >
                        <Copy size={16}/>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Gavel size={16} className="text-gray-400"/>
                        <span className="font-medium">Base Legal:</span> 
                        <span className="italic">{article.legislacao}</span>
                        <ExternalLink size={12} className="text-blue-500 cursor-pointer hover:underline"/>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 mr-2">Esta informação foi útil?</span>
                        
                        {/* Botão Útil (Thumbs Up) */}
                        <button 
                          onClick={(e) => handleFeedback(article.id, 'up', e)} 
                          className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                            userFeedback[article.id] === 'up'
                              ? 'bg-green-100 text-green-700 ring-1 ring-green-500'
                              : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                          }`}
                          title="Útil"
                        >
                          <ThumbsUp size={18} fill={userFeedback[article.id] === 'up' ? "currentColor" : "none"} />
                        </button>

                        {/* Botão Não Útil (Thumbs Down) */}
                        <button 
                          onClick={(e) => handleFeedback(article.id, 'down', e)} 
                          className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                            userFeedback[article.id] === 'down'
                              ? 'bg-red-100 text-red-700 ring-1 ring-red-500'
                              : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                          }`}
                          title="Não Útil"
                        >
                          <ThumbsDown size={18} fill={userFeedback[article.id] === 'down' ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Empty State com Ação (Sugestão)
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={32}/>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Nenhum resultado encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Não encontramos nada para "<strong>{searchTerm}</strong>". Tente usar termos mais genéricos ou sugira este tópico para a base.
              </p>
              
              <form onSubmit={handleSuggestion} className="max-w-md mx-auto flex gap-2">
                <input 
                  type="text" 
                  placeholder="Descreva o que você estava procurando..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sefaz-blue"
                  required
                />
                <button type="submit" className="bg-sefaz-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
                  <Send size={14}/> Sugerir
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}