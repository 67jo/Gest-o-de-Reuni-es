import { Outlet } from "react-router-dom";
import { Aside } from "./Aside";
import { Header } from "./Header";

export function PrivateLayout() {
  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      {/* O Aside fixo à esquerda */}
      <Aside />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* O Header fixo no topo da área principal */}
        <Header />
        
        {/* É aqui que o Dashboard, ou qualquer outra página privada, vai renderizar */}
        <Outlet />
      </div>
    </div>
  );
}