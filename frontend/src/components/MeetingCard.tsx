import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Meeting, MeetingStatus } from '@/types/meetings';
import { MeetingStatusBadge } from './MeetingStatusBadge';
import { MeetingActionsMenu } from './MeetingActionsMenu';

interface MeetingCardProps {
  meeting: Meeting;
  roomName: string;
  onEdit: (meeting: Meeting) => void;
  onStatusChange: (id: string, status: MeetingStatus) => void;
}

const formatMeetingDate = (isoDate: string) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('pt-AO', { weekday: 'long', day: '2-digit', month: '2-digit' });
};

const formatMeetingTime = (start: string, end: string) => {
  if (!start || !end) return '';
  const s = new Date(start).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
  const e = new Date(end).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
  return `${s} - ${e}`;
};

export function MeetingCard({ meeting, roomName, onEdit, onStatusChange }: MeetingCardProps) {
  return (
    <Card className="group flex flex-col gap-4 p-5 transition-all hover:border-indigo-100 hover:shadow-md md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex-1">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
            {meeting.title}
          </h3>
          <MeetingStatusBadge status={meeting.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2 capitalize">
            <CalendarIcon size={16} className="text-slate-400" />
            {formatMeetingDate(meeting.date_start)}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            {formatMeetingTime(meeting.date_start, meeting.date_end)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            {roomName}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-4 md:mt-0 md:justify-end md:border-t-0 md:pt-0">
        <div className="flex -space-x-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
            alt="Participante"
            className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm"
          />
        </div>
        <MeetingActionsMenu meeting={meeting} onEdit={onEdit} onStatusChange={onStatusChange} />
      </div>
    </Card>
  );
}