import { Users, MapPin, Settings, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { roomStatusBadgeClass } from '@/lib/room-status';
import { resourceIconMap } from '@/lib/room-resources';
import type { Room } from '@/hooks/useRoomsData';

interface RoomCardProps {
  room: Room;
  onRemove: (id: number) => void;
}

export function RoomCard({ room, onRemove }: RoomCardProps) {
  const resources = room.resources ?? ['Wi-Fi'];

  return (
    <Card className="group flex flex-col gap-4 p-5 transition-all hover:border-indigo-100 hover:shadow-md md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex-1">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
            {room.nome}
          </h3>
          <Badge className={`rounded-md text-[10px] font-bold uppercase tracking-wider ${roomStatusBadgeClass(room.status)}`}>
            {room.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            Capacidade: {room.capacidade} pessoas
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            {room.localizacao || 'Não definida'}
          </div>
          <div className="ml-0 flex items-center gap-3 border-slate-200 pl-0 md:ml-4 md:border-l md:pl-4">
            {resources.map((res, idx) => {
              const Icon = resourceIconMap[res];
              return (
                <div key={idx} className="flex items-center gap-1" title={res}>
                  {Icon && <Icon size={14} className="text-slate-500" />}
                  <span className="text-xs">{res}</span>
                </div>
              );
            })}
          </div>
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