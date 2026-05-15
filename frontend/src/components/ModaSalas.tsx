import { X, DoorOpen, CheckCircle2 } from 'lucide-react';
import React from 'react';

// Definir a interface das Props para o TypeScript não reclamar
interface ModalSalaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newRoom: {
    name: string;
    capacity: string | number;
    location: string;
    status: string;
  };
  setNewRoom: (room: any) => void;
}

export const ModalSala = ({ isOpen, onClose, onSubmit, newRoom, setNewRoom }: ModalSalaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <DoorOpen className="text-indigo-600" />
            Adicionar Nova Sala
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Sala *</label>
            <input 
              type="text" 
              required
              value={newRoom.name}
              onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
              placeholder="Ex: Sala Gamma"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Capacidade *</label>
              <input 
                type="number" 
                required
                min="1"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                placeholder="Ex: 10"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select 
                value={newRoom.status}
                onChange={(e) => setNewRoom({...newRoom, status: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
              >
                {/* ATENÇÃO: Values em minúsculo para bater com o Backend */}
                <option value="disponível">Disponível</option>
                <option value="ocupada">Ocupada</option>
                <option value="manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Localização *</label>
            <input 
              type="text" 
              required
              value={newRoom.location}
              onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
              placeholder="Ex: Andar 3 - Bloco C"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> 
              Salvar Sala
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};