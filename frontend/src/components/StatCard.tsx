import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconWrapClass: string;
  barClass?: string;
  percentage?: number;
  highlight?: boolean;
}

export function StatCard({ label, value, icon: Icon, iconWrapClass, barClass, percentage, highlight }: StatCardProps) {
  if (highlight) {
    return (
      <Card className="relative overflow-hidden shadow-sm">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 blur-2xl transition-colors group-hover:bg-indigo-100" />
        <CardContent className="p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <div className="mb-4 text-4xl font-black text-indigo-900">{value}</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>Atualizado agora</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col justify-between p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconWrapClass}`}>
            <Icon size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{value}</span>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">{label}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${barClass}`}
              style={{ width: `${percentage ?? 0}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}