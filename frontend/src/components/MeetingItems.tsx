import { type Meeting } from '../types/meetings';
import { format } from 'date-fns';

interface MeetingItemProps {
  meeting: Meeting;
}

export const MeetingItem = ({ meeting }: MeetingItemProps) => {
  const isCanceled = meeting.status === 'CANCELADA';

  return (
    <div className="px-8 py-6 hover:bg-slate-100/50 transition-colors flex items-center group">
      <div className="w-16 flex flex-col items-center justify-center text-center mr-8">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {format(new Date(meeting.date_start), 'MMM')}
        </span>

        <span
          className={`text-2xl font-black font-manrope ${
            isCanceled ? 'text-opacity-40' : 'text-blue-900'
          }`}
        >
          {format(new Date(meeting.date_start), 'dd')}
        </span>
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1">
          <h3
            className={`font-bold text-lg font-manrope group-hover:text-blue-700 transition-colors ${
              isCanceled ? 'line-through text-slate-400' : ''
            }`}
          >
            {meeting.title}
          </h3>

          <StatusBadge status={meeting.status} />
        </div>

        <div
          className={`flex items-center gap-4 text-slate-500 text-sm ${
            isCanceled ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>

            {format(new Date(meeting.date_start), 'p')} -{' '}
            {format(new Date(meeting.date_end), 'p')}
          </div>

          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              {meeting.room.includes('Virtual')
                ? 'videocam'
                : 'location_on'}
            </span>

            {meeting.room}
          </div>
        </div>
      </div>

      {/* Avatares e Botão de Ações aqui... */}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDENTE: 'bg-blue-100 text-blue-800',
    DECORRENDO: 'bg-amber-100 text-amber-800',
    CANCELADA: 'bg-rose-100 text-rose-800',
    TERMINADA: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <span
      className={`px-3 py-1 ${
        styles[status]
      } text-[10px] font-bold rounded-full uppercase`}
    >
      {status}
    </span>
  );
};