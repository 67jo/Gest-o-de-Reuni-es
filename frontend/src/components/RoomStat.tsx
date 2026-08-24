import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RoomStatProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconWrapClass: string;
}

export function RoomStat({ label, value, icon: Icon, iconWrapClass }: RoomStatProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrapClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-slate-400">{label}</p>
          <p className="text-2xl font-black text-slate-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}