import type { MeetingStatus } from '@/types/meetings';
import { CalendarCheck, CheckCircle2, XCircle, Clock3 } from 'lucide-react';

export const meetingStatusConfig: Record<MeetingStatus, {
  label: string;
  badgeClass: string;
  barClass: string;
  icon: typeof CalendarCheck;
  iconWrapClass: string;
}> = {
  PENDENTE: {
    label: 'Pendente',
    badgeClass: 'bg-yellow-100 text-yellow-700',
    barClass: 'bg-yellow-500',
    icon: Clock3,
    iconWrapClass: 'bg-yellow-50 text-yellow-600'
  },
  DECORRENDO: {
    label: 'A decorrer',
    badgeClass: 'bg-blue-100 text-blue-700',
    barClass: 'bg-blue-500',
    icon: CalendarCheck,
    iconWrapClass: 'bg-blue-50 text-blue-600'
  },
  TERMINADA: {
    label: 'Terminada',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    barClass: 'bg-emerald-500',
    icon: CheckCircle2,
    iconWrapClass: 'bg-emerald-50 text-emerald-600'
  },
  CANCELADA: {
    label: 'Cancelada',
    badgeClass: 'bg-rose-100 text-rose-700',
    barClass: 'bg-rose-500',
    icon: XCircle,
    iconWrapClass: 'bg-rose-50 text-rose-600'
  }
};