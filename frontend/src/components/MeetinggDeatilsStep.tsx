import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { category, room, MeetingStatus } from '@/types/meetings';
import type { MeetingFormData } from '@/hooks/useMeetingForm';

interface MeetingDetailsStepProps {
  formData: MeetingFormData;
  updateField: <K extends keyof MeetingFormData>(field: K, value: MeetingFormData[K]) => void;
  dbCategories: category[];
  dbRooms: room[];
  isEditMode: boolean;
}

const statusOptions: MeetingStatus[] = ['PENDENTE', 'DECORRENDO', 'CANCELADA', 'TERMINADA'];
const statusLabels: Record<MeetingStatus, string> = {
  PENDENTE: 'Pendente',
  DECORRENDO: 'A decorrer',
  CANCELADA: 'Cancelada',
  TERMINADA: 'Terminada'
};

export function MeetingDetailsStep({ formData, updateField, dbCategories, dbRooms, isEditMode }: MeetingDetailsStepProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div>
        <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título da Reunião</Label>
        <Input
          placeholder="Ex: Alinhamento de Design"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="h-11 w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
            <SelectTrigger className="h-11 w-full py-6">
              <SelectValue placeholder="Selecione...">
                {(value: string) => dbCategories.find(cat => cat.id === value)?.name || 'Selecione...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {dbCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sala de Reunião</Label>
          <Select value={formData.room} onValueChange={(value) => updateField('room', value)}>
            <SelectTrigger className="h-11 w-full py-6">
              <SelectValue placeholder="Selecione a sala...">
                {(value: string) => dbRooms.find(r => r.id === value)?.name || 'Selecione a sala...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {dbRooms.map(r => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isEditMode && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => updateField('status', value as MeetingStatus)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue>
                  {(value: MeetingStatus) => statusLabels[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}