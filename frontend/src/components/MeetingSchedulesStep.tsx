import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import type { MeetingFormData } from '@/hooks/useMeetingForm';

interface MeetingScheduleStepProps {
  formData: MeetingFormData;
  updateField: <K extends keyof MeetingFormData>(field: K, value: MeetingFormData[K]) => void;
  viewDate: Date;
  setViewDate: (date: Date) => void;
}

export function MeetingScheduleStep({ formData, updateField, viewDate, setViewDate }: MeetingScheduleStepProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <Calendar
        mode="single"
        locale={ptBR}
        selected={formData.date ?? undefined}
        onSelect={(date) => date && updateField('date', date)}
        month={viewDate}
        onMonthChange={setViewDate}
        className="rounded-xl border border-slate-200 mx-auto"
      />

      <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-400">
            <Clock size={14} /> Início
          </Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-400">
            <Clock size={14} /> Fim
          </Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}