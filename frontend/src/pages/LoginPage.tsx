import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { criarSessao } from '../services/session.services';
import { ErrorFormAlert } from '../components/errorForm'

// Se estiver usando o React Router para navegar após o login:
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  // --- ESTADOS ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // --- LÓGICA DE SUBMISSÃO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Chamada ao serviço que conecta com o Fastify + MySQL
      const data = await criarSessao({ email, password });

      // Persistência do Token JWT e dados básicos do usuário
      localStorage.setItem('@ExecutiveLens:token', data.token);
      localStorage.setItem('@ExecutiveLens:user', JSON.stringify(data.user));

      console.log("Autenticação realizada com sucesso!");
      
      // Feedback visual e Redirecionamento
      alert(`Bem-vindo de volta, ${data.user.name}!`);
      navigate('/dashboard'); 
      
    } catch (err: any) {
      // Tratamento de erro vindo do backend (ex: senha incorreta ou usuário inexistente)
      const message = err.response?.data?.message || "Erro ao conectar com o servidor corporativo.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-corporate-mesh font-body text-on-surface min-h-screen flex flex-col items-center justify-between selection:bg-primary-fixed selection:text-on-primary-fixed relative overflow-x-hidden">
      
      {/* Barra Decorativa Superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-container to-surface-tint opacity-20 z-50"></div>

      {/* Background & Overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <img
          className="w-full h-full object-cover opacity-10 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
          alt="Corporate Background"
        />
      </div>

      <main className="flex-grow flex items-center justify-center w-full px-6 py-12 z-10">
        <div className="w-full max-w-[480px]">
          
          {/* Header do Sistema */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
              Executive Lens
            </h1>
            <p className="text-on-surface-variant font-label tracking-wide text-xs uppercase mt-2">
              Editorial Precision in Leadership
            </p>
          </div>

          {/* Card Glassmorphism */}
          <div className="glass-effect rounded-xl p-10 md:p-12 shadow-[0px_12px_40px_rgba(25,28,30,0.08)]">
            <div className="mb-8">
              <h2 className="text-2xl font-headline font-bold text-on-surface">Acesse sua conta</h2>
              <p className="text-on-surface-variant text-sm mt-1">Insira suas credenciais corporativas abaixo.</p>
            </div>

            {/* Alerta de Erro UI */}
            {errorMessage && (
             <ErrorFormAlert errorMessage={errorMessage}/>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-label font-semibold text-secondary uppercase tracking-widest mb-2" htmlFor="email">
                  Email Corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-on-surface placeholder:text-outline-variant/50"
                    id="email"
                    type="email"
                    placeholder="exemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-label font-semibold text-secondary uppercase tracking-widest" htmlFor="password">
                    Senha
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                  <input
                    className="w-full pl-12 pr-12 py-3 bg-surface-container-lowest border border-outline/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-on-surface placeholder:text-outline-variant/50"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-outline/30 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                    Lembrar acesso
                  </span>
                </label>
                <a className="text-primary font-semibold hover:text-surface-tint transition-colors" href="#forgot">
                  Recuperar acesso
                </a>
              </div>

              {/* Botão de Submit com Loading State */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-lg shadow-lg hover:shadow-primary/30 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  "Entrar no Sistema"
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline/5 text-center">
              <p className="text-sm text-on-surface-variant">
                Dificuldades no acesso?{' '}
                <a className="text-primary font-bold hover:underline" href="#suporte">Falar com TI</a>
              </p>
            </div>
          </div>

          {/* Selo de Segurança */}
          <div className="mt-8 flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-label font-medium uppercase tracking-[0.2em] text-on-surface-variant">
              Secure Corporate Access Architecture
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-12 flex flex-wrap justify-center gap-6 text-slate-400 font-body text-[11px] tracking-wide">
        <span>© 2024 Executive Lens. Multitel Corporate System.</span>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#privacy">Privacidade</a>
          <a className="hover:text-primary transition-colors" href="#terms">Termos</a>
          <a className="hover:text-primary transition-colors" href="#support">Suporte</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;