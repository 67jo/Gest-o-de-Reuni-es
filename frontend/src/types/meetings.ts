export type MeetingStatus = 'Scheduled' | 'Completed' | 'Canceled';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  status: MeetingStatus;
  attendees: {
    avatarUrl: string;
    name: string;
  }[];
}