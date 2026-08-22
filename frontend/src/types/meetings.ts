export type MeetingStatus = 'PENDENTE' | 'DECORRENDO' | 'CANCELADA' | 'TERMINADA';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date_start: string;
  date_end: string;
  room: string;
  responsible: string;
  status: MeetingStatus;
  category: string;
  n_participants: number;
}

export interface category {
  id: string;
  name: string;
}

export interface room {
  id: string;
  name: string;
  n_participants_supoerted: number;
}

export interface ModalMeetingData {
  categoryAll: category[];
  roomAll: room[];
}

// Payload usado para criar/editar reunião (ainda não tem id, gerado pelo backend)
export type MeetingPayload = Omit<Meeting, 'id'>;