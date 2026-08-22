import { useCallback, useEffect, useState } from 'react';
import api from '@/api/axios';
import type { Meeting, room } from '@/types/meetings';

export function useDashboardData() {
  const [meetingsList, setMeetingsList] = useState<Meeting[]>([]);
  const [roomsList, setRoomsList] = useState<room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meetingsRes, modalDataRes] = await Promise.all([
        api.get<Meeting[]>('/meeting/list'), // confirmar endpoint real de listagem
        api.get('/meeting/modal-data')
      ]);
      setMeetingsList(meetingsRes.data);
      setRoomsList(modalDataRes.data.rooms ?? []);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getRoomName = (roomId: string) => {
    const found = roomsList.find(r => r.id === roomId);
    return found ? found.name : `Sala ${roomId}`;
  };

  return { meetingsList, roomsList, loading, error, fetchDashboardData, getRoomName };
}