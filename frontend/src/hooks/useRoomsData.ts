import { useCallback, useEffect, useState } from 'react';
import api from '@/api/axios';

export interface Room {
  id: number;
  nome: string;
  capacidade: number;
  localizacao?: string;
  status: string;
  resources?: string[];
}

export function useRoomsData() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Room[]>('/salas'); // confirmar endpoint real
      setRooms(Array.isArray(response.data) ? response.data : []);
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

  const removeRoom = async (id: number) => {
    await api.delete(`/salas/${id}`);
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const addRoom = async (payload: { nome: string; capacidade: number; status: string; localizacao: string }) => {
    await api.post('/salas', payload);
    await fetchRooms();
  };

  return { rooms, loading, error, fetchRooms, removeRoom, addRoom };
}