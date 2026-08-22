import { MoreVertical, Edit3, CheckCircle2, XCircle, CalendarCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Meeting, MeetingStatus } from '@/types/meetings';

interface MeetingActionsMenuProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onStatusChange: (id: string, status: MeetingStatus) => void;
}

export function MeetingActionsMenu({ meeting, onEdit, onStatusChange }: MeetingActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 transition-colors hover:border-indigo-100 hover:bg-white hover:text-indigo-600"
      >
        <MoreVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Ações
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(meeting)} className="gap-2 font-semibold text-indigo-600">
          <Edit3 size={18} /> Editar Reunião
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Alterar Estado
        </DropdownMenuLabel>

        {meeting.status !== 'TERMINADA' && (
          <DropdownMenuItem onClick={() => onStatusChange(meeting.id, 'TERMINADA')} className="gap-2 font-semibold text-emerald-600">
            <CheckCircle2 size={18} /> Marcar como Concluída
          </DropdownMenuItem>
        )}
        {meeting.status !== 'CANCELADA' && (
          <DropdownMenuItem onClick={() => onStatusChange(meeting.id, 'CANCELADA')} className="gap-2 font-semibold text-rose-600">
            <XCircle size={18} /> Cancelar Reunião
          </DropdownMenuItem>
        )}
        {meeting.status !== 'PENDENTE' && (
          <DropdownMenuItem onClick={() => onStatusChange(meeting.id, 'PENDENTE')} className="gap-2 font-semibold text-blue-600">
            <CalendarCheck size={18} /> Reabrir Agendamento
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}