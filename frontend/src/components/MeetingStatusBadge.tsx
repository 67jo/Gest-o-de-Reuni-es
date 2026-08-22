import type { MeetingStatus } from '@/types/meetings';
import { meetingStatusConfig } from '@/lib/meeting-status';
import { Badge } from '@/components/ui/badge';

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  const config = meetingStatusConfig[status];
  return (
    <Badge className={`rounded-md text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}>
      {config.label}
    </Badge>
  );
}