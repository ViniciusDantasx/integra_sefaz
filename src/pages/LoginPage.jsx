import React, { useState } from 'react';
import { Eye, EyeOff, UserCog, User, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [view, setView] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [emailRecovery, setEmailRecovery] = useState('');

  const handleSimulatedLogin = (role) => {
    onLogin(role);
  };

  const handleSendRecovery = (e) => {
    e.preventDefault();
    console.log(`Enviando email de recuperação para: ${emailRecovery}`);
    setView('success');
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-900">
      
      {/* === BACKGROUND === */}
      <div className="absolute inset-0 bg-gradient-to-br from-sefaz-blue via-[#003366] to-slate-900"></div>
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl filter"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-3xl filter"></div>

      {/* === CONTEÚDO === */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm border border-white/20">
          
          <div className="mb-6 flex justify-center">
            <img src="/logomarca1.png" alt="Logo SEFAZ" className="h-16" />
          </div>
          
          {/* === VISÃO 1: LOGIN === */}
          {view === 'login' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-sefaz-blue tracking-tight">
                  Integra Sefaz
                </h2>
                <p className="mt-2 text-base text-gray-600 font-medium">
                  Plataforma de atendimento unificado
                </p>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-5">
                  <label className="mb-1 block text-sm font-bold text-gray-700">Usuário</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-sefaz-blue focus:bg-white focus:ring-2 focus:ring-sefaz-blue/20 transition-all outline-none" 
                    defaultValue="usuario.sefaz" 
                  />
                </div>
                
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-bold text-gray-700">Senha</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-sefaz-blue focus:bg-white focus:ring-2 focus:ring-sefaz-blue/20 transition-all outline-none" 
                      defaultValue="123456" 
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sefaz-blue" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <button 
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs font-semibold text-sefaz-blue hover:text-blue-800 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => handleSimulatedLogin('admin')}
                    className="group w-full flex items-center justify-center rounded-lg bg-sefaz-blue p-3.5 font-bold text-white shadow-md hover:bg-sefaz-blue-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <UserCog className="w-5 h-5 mr-2 opacity-90 group-hover:opacity-100" />
                    Entrar como Gestor
                  </button>
                  
                  <button 
                    onClick={() => handleSimulatedLogin('agent')}
                    className="group w-full flex items-center justify-center rounded-lg border-2 border-sefaz-blue p-3.5 font-bold text-sefaz-blue hover:bg-blue-50 transition-all"
                  >
                    <User className="w-5 h-5 mr-2 opacity-90 group-hover:opacity-100" />
                    Entrar como Atendente
                  </button>
                </div>
              </form>
            </>
          )}

          {/* === VISÃO 2: RECUPERAÇÃO === */}
          {view === 'forgot' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setView('login')}
                className="mb-6 flex items-center text-sm font-bold text-gray-500 hover:text-sefaz-blue transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </button>

              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-7 w-7 text-sefaz-blue" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800">Recuperar Acesso</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Digite seu e-mail institucional para receber o link.
                </p>
              </div>

              <form onSubmit={handleSendRecovery}>
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-bold text-gray-700">E-mail Institucional</label>
                  <input 
                    type="email" 
                    required
                    placeholder="nome.sobrenome@sefaz.pe.gov.br"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-sefaz-blue focus:bg-white focus:ring-2 focus:ring-sefaz-blue/20 outline-none transition-all" 
                    value={emailRecovery}
                    onChange={(e) => setEmailRecovery(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full rounded-lg bg-sefaz-blue p-3.5 font-bold text-white shadow hover:bg-sefaz-blue-dark transition-all"
                >
                  Enviar Link
                </button>
              </form>
            </div>
          )}

          {/* === VISÃO 3: SUCESSO === */}
          {view === 'success' && (
            <div className="text-center animate-in fade-in zoom-in duration-300 py-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="mb-2 text-2xl font-extrabold text-gray-800">E-mail Enviado!</h2>
              <p className="mb-8 text-sm text-gray-600 leading-relaxed">
                As instruções foram enviadas para:<br/>
                <strong className="text-sefaz-blue text-base block mt-1">{emailRecovery}</strong>
              </p>
              
              <button 
                onClick={() => {
                  setView('login');
                  setEmailRecovery('');
                }}
                className="w-full rounded-lg border-2 border-sefaz-blue p-3.5 font-bold text-sefaz-blue hover:bg-blue-50 transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          )}

        </div>
        
        {/* === RODAPÉ RESTAURADO (Estilo Anterior) === */}
        <p className="mt-8 text-center text-xs text-white/40 leading-relaxed">
          &copy; 2025 Secretaria da Fazenda - Governo do Estado. <br/>
          Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}