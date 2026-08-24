import { useCallback, useEffect, useState } from 'react';
import { roomServices } from '@/services/room.services';


export function useRoomsData() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomServices.getAll();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar salas:', err);
      setError('Não foi possível carregar as salas.');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const removeRoom = async (id: string) => {
    await roomServices.remove(id);
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const addRoom = async (payload: RoomPayload) => {
    await roomServices.create(payload);
    await fetchRooms();
  };

  return { rooms, loading, error, fetchRooms, removeRoom, addRoom };
}