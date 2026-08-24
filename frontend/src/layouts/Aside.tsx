import { Settings, LayoutDashboard, DoorOpen, Users, LogOut, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const Aside = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/salas', label: 'Salas de Reunião', icon: DoorOpen },
    { path: '/participantes', label: 'Participantes', icon: Users },
  ];

  const secondaryItems = [
    { path: '/configuracoes', label: 'Configurações', icon: Settings },
    { path: '/ajuda', label: 'Centro de Ajuda', icon: HelpCircle },
  ];

  const handleLogout = async () =>{
    const msg  = await logout()

    navigate("/")
    toast.info(msg)
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col z-20 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* LOGO AREA - Agora com h-16 para alinhar perfeitamente com o Header */}
      <div className="h-16 flex items-center px-8 border-b border-slate-100/80">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Multitel <span className="text-indigo-600">SIGI</span>
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-8">
        
        {/* Gestão Principal */}
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-4 px-4">
            Menu Principal
          </p>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm shadow-indigo-100/50' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <Icon size={19} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Suporte & Sistema */}
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-4 px-4">
            Sistema
          </p>
          <nav className="flex flex-col gap-1.5">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 font-medium transition-all duration-200"
                >
                  <Icon size={19} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* FOOTER - Limpo, sem redundância de perfil */}
      <div className="p-4 border-t border-slate-100">
        <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group">
          <div className="flex items-center gap-3">
            <LogOut size={19} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span className="text-sm font-semibold">Terminar Sessão</span>
          </div>
        </button>
        
        <div className="mt-4 px-4">
          <p className="text-[10px] text-slate-300 font-medium">
            © 2026 Multitel Inovação
          </p>
          <p className="text-[9px] text-slate-300">
            v2.4.0-stable
          </p>
        </div>
      </div>
    </aside>
  );
};