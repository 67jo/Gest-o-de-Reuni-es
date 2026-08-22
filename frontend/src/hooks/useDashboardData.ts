import { useCallback, useEffect, useState } from 'react';
import { meetingServices } from '@/services/meeting.services';
import type { Meeting, room } from '@/types/meetings';

export function useDashboardData(year: number, month: number) {
    const [meetingsList, setMeetingsList] = useState<Meeting[]>([]);
    const [roomsList, setRoomsList] = useState<room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [meetingsData, modalData] = await Promise.all([
                meetingServices.getAll({ year, month: month + 1 }), // month vem 0-indexed do Date
                meetingServices.getMeetingModalData()
            ]);

            const meetings: Meeting[] = (meetingsData.meetingData ?? []).map(m => ({
                ...m,
                responsible: (m as any).responsible_id ?? (m as any).responsible
            }));

            setMeetingsList(meetings);
            setRoomsList(Array.isArray(modalData.roomAll) ? modalData.roomAll : []);
        } catch (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
            setError('Não foi possível carregar os dados do dashboard.');
            setMeetingsList([]);
            setRoomsList([]);
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getRoomName = (roomId: string) => {
        const found = roomsList.find(r => r.id === roomId);
        return found ? found.name : `Sala ${roomId}`;
    };

    return { meetingsList, roomsList, loading, error, fetchDashboardData, getRoomName };
}