import { DoorOpen } from 'lucide-react';

export function RoomsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
      <DoorOpen size={48} className="mx-auto mb-4 text-slate-300" />
      <p className="font-medium text-slate-500">Nenhuma sala cadastrada no sistema.</p>
    </div>
  );
}