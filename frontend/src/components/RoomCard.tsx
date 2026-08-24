import { Users, Settings, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoomCardProps {
  room: Room;
  onRemove: (id: string) => void;
}

export function RoomCard({ room, onRemove }: RoomCardProps) {
  return (
    <Card className="group flex flex-col gap-4 p-5 transition-all hover:border-indigo-100 hover:shadow-md md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex-1">
        <h3 className="mb-3 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
          {room.name}
        </h3>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Users size={16} className="text-slate-400" />
          Capacidade: {room.n_participants_suported} pessoas
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-4 md:mt-0 md:border-t-0 md:pt-0">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 hover:text-indigo-600">
          <Settings size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(room.id)}
          title="Remover Sala"
          className="text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={20} />
        </Button>
      </div>
    </Card>
  );
}