import { useMemo, useState } from 'react';
import { DoorOpen, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalSala } from '../components/ModaSalas';
import { useSearch } from '../context/SearchContext';
import { useRoomsData } from '../hooks/useRoomsData';
import { RoomStat } from '../components/RoomStat';
import { RoomCard } from '../components/RoomCard';
import { RoomsEmptyState } from '../components/RoomEmptyState';

export default function Salas() {
  const { rooms, loading, error, removeRoom, addRoom } = useRoomsData();
  const { searchTerm } = useSearch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: ''
  });

  const filteredRooms = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rooms.filter(room => room.name.toLowerCase().includes(term));
  }, [rooms, searchTerm]);

  const stats = useMemo(() => ({
    total: rooms.length,
    totalCapacity: rooms.reduce((acc, curr) => acc + (curr.n_participants_suported || 0), 0)
  }), [rooms]);

  const handleRemoveRoom = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta sala permanentemente?')) return;
    try {
      await removeRoom(id);
    } catch (err) {
      console.error('Erro ao remover:', err);
      alert('Não foi possível remover a sala.');
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.capacity) return;

    try {
      await addRoom({
        name: newRoom.name,
        n_participants_suported: parseInt(newRoom.capacity)
      });
      setIsModalOpen(false);
      setNewRoom({ name: '', capacity: '' });
    } catch (err) {
      console.error('Erro ao criar sala:', err);
      alert('Erro ao salvar sala no servidor.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 pb-24 lg:px-12">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <DoorOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold tracking-tight text-indigo-700 lg:text-3xl">Gestão de Salas</h1>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
            >
              <Plus size={20} />
              Nova Sala
            </Button>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <RoomStat label="Total de Salas" value={stats.total} icon={DoorOpen} iconWrapClass="bg-indigo-50 text-indigo-600" />
            <RoomStat label="Capacidade Total" value={`${stats.totalCapacity} lugares`} icon={Users} iconWrapClass="bg-blue-50 text-blue-600" />
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">Salas Cadastradas</h2>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {rooms.length}
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-slate-400">Carregando salas...</div>
              ) : error ? (
                <div className="py-10 text-center text-rose-500">{error}</div>
              ) : filteredRooms.length === 0 ? (
                <RoomsEmptyState />
              ) : (
                filteredRooms.map(room => (
                  <RoomCard key={room.id} room={room} onRemove={handleRemoveRoom} />
                ))
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