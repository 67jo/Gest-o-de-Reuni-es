import { useState, useEffect } from 'react';
import { 
  Settings, DoorOpen, Users, 
  Plus, MapPin, Trash2, Monitor, Wifi, Projector, CheckCircle2 
} from 'lucide-react';
import api from '../api/axios';
import { ModalSala } from '../components/ModaSalas';
import { useSearch } from '../context/SearchContext';

// Interface para facilitar a tipagem e o mapeamento do Backend
interface Room {
  id: number;
  nome: string;
  capacidade: number;
  localizacao?: string;
  status: string;
  resources?: string[];
}

export default function Salas() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  // Estados do Modal de Adicionar Sala
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    location: 'Miramar',
    status: 'disponível'
  });

  // 1. CARREGAR SALAS DO BACKEND
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/salas');
      setRooms(response.data);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 2. FUNÇÃO PARA REMOVER SALA (DELETE)
  const handleRemoveRoom = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover esta sala permanentemente?')) {
      try {
        await api.delete(`/salas/${id}`);
        setRooms(rooms.filter(room => room.id !== id));
      } catch (error) {
        console.error("Erro ao remover:", error);
        alert("Não foi possível remover a sala.");
      }
    }
  };

  // 3. FUNÇÃO PARA SUBMETER NOVA SALA (POST)
  const handleAddRoom = async (e: any) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.capacity) return;

    try {
      const payload = {
        nome: newRoom.name,
        capacidade: parseInt(newRoom.capacity),
        status: newRoom.status.toLowerCase(),
        localizacao: newRoom.location || 'Miramar' // Valor padrão caso vazio
      };

      await api.post('/salas', payload);
      
      // Resetar e recarregar
      setIsModalOpen(false);
      setNewRoom({ name: '', capacity: '', location: '', status: 'disponível' });
      fetchRooms(); 
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      alert("Erro ao salvar sala no servidor.");
    }
  };

  const renderResourceIcon = (resource: string) => {
    switch (resource) {
      case 'TV': return <Monitor size={14} className="text-slate-500" />;
      case 'Wi-Fi': return <Wifi size={14} className="text-slate-500" />;
      case 'Projetor': return <Projector size={14} className="text-slate-500" />;
      default: return null;
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.localizacao && room.localizacao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-8 lg:px-12 pb-24">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <DoorOpen className="text-indigo-600 w-8 h-8" />
              <h1 className="text-2xl lg:text-3xl font-bold text-indigo-700 tracking-tight">Gestão de Salas</h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={20} />
              Nova Sala
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <DoorOpen size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase">Total de Salas</p>
                <p className="text-2xl font-black text-slate-800">{rooms.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase">Disponíveis</p>
                <p className="text-2xl font-black text-slate-800">
                  {rooms.filter(r => r.status.toLowerCase() === 'disponível' || r.status.toLowerCase() === 'disponivel').length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase">Capacidade Total</p>
                <p className="text-2xl font-black text-slate-800">
                  {rooms.reduce((acc, curr) => acc + (curr.capacidade || 0), 0)} lugares
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Salas Cadastradas</h2>
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {rooms.length}
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10 text-slate-400">Carregando salas...</div>
              ) : (
                filteredRooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-indigo-100 transition-all group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {room.nome}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          room.status.toLowerCase() === 'disponível' || room.status.toLowerCase() === 'disponivel' ? 'bg-emerald-100 text-emerald-700' : 
                          room.status.toLowerCase() === 'ocupada' ? 'bg-rose-100 text-rose-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {room.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-400" />
                          Capacidade: {room.capacidade} pessoas
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          {room.localizacao || 'Não definida'}
                        </div>
                        <div className="flex items-center gap-3 ml-0 md:ml-4 pl-0 md:pl-4 md:border-l border-slate-200">
                          {(room.resources || ['Wi-Fi']).map((res, idx) => (
                            <div key={idx} className="flex items-center gap-1" title={res}>
                              {renderResourceIcon(res)}
                              <span className="text-xs">{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                      <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <Settings size={20} />
                      </button>
                      <button 
                        onClick={() => handleRemoveRoom(room.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Remover Sala"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              {!loading && rooms.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                  <DoorOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Nenhuma sala cadastrada no sistema.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
       <ModalSala 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddRoom}
            newRoom={newRoom}
            setNewRoom={setNewRoom}
        />
      )}
    </div>
  );
}