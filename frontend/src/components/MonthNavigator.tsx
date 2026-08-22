import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function MonthNavigator({ label, onPrev, onNext, onToday }: MonthNavigatorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onPrev} className="text-slate-500 hover:text-indigo-600">
          <ChevronLeft size={20} />
        </Button>
        <span className="min-w-[160px] px-6 text-center text-sm font-semibold text-slate-700">{label}</span>
        <Button variant="ghost" size="icon" onClick={onNext} className="text-slate-500 hover:text-indigo-600">
          <ChevronRight size={20} />
        </Button>
      </div>
      <Button variant="outline" onClick={onToday} className="font-semibold text-slate-700 hover:text-indigo-600">
        Mês Atual
      </Button>
    </div>
  );
}