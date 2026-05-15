import { Search, Bell, X, User } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const Header = () => {
    const { searchTerm, setSearchTerm } = useSearch();

    return (
        <div className="w-full sticky top-0 z-50">
            {/* Glassmorphism Header */}
            <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex justify-between items-center px-8 shadow-sm shadow-slate-200/20">
                
                {/* Search Bar Group */}
                <div className="flex items-center group relative">
                    <div className="flex items-center bg-slate-100/50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/50 w-80 focus-within:w-96 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/40 focus-within:bg-white transition-all duration-300 ease-out">
                        <Search size={18} className="text-slate-400 mr-2 group-focus-within:text-indigo-500 transition-colors" />
                        
                        <input 
                            type="text" 
                            placeholder="Pesquisar reuniões, salas..." 
                            className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Botão para limpar a busca (Aparece apenas se houver texto) */}
                        {searchTerm.length > 0 && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="ml-2 p-0.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    
                    {/* Atalho visual (opcional - charmoso para Dashboards) */}
                    {searchTerm.length === 0 && (
                        <div className="absolute right-3 pointer-events-none">
                            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-medium text-slate-400 opacity-100">
                                <span>⌘</span>K
                            </kbd>
                        </div>
                    )}
                </div>

                {/* Right Actions: Notifications & Profile */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all relative active:scale-90">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                    </button>

                    <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                    {/* User Profile Hookup */}
                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Admin Multitel</p>
                            <p className="text-[10px] text-slate-400 font-medium">Visualizador</p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:rotate-3 transition-transform">
                            <User size={18} />
                        </div>
                    </button>
                </div>
            </header>
        </div>
    );
};