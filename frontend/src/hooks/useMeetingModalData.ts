import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { meetingServices } from '@/services/meeting.services';
import type { category, room } from '@/types/meetings';

export interface MeetingUser {
  id: string;
  nome_completo: string;
  departamento?: string;
}

interface UseMeetingModalDataResult {
  dbUsers: MeetingUser[];
  dbRooms: room[];
  dbCategories: category[];
  loadingData: boolean;
}

/**
 * Carrega os dados de apoio ao modal de reunião (utilizadores, salas e categorias)
 * sempre que o modal é aberto. Usa Promise.allSettled para que a falha de um dos
 * pedidos não impeça os restantes de preencherem o estado.
 */
export function useMeetingModalData(isOpen: boolean): UseMeetingModalDataResult {
  const [dbUsers, setDbUsers] = useState<MeetingUser[]>([]);
  const [dbRooms, setDbRooms] = useState<room[]>([]);
  const [dbCategories, setDbCategories] = useState<category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingData(true);
    Promise.allSettled([
      api.get('/user-list'),
      meetingServices.getMeetingModalData()
    ])
      .then(([usersResult, modalDataResult]) => {
        if (usersResult.status === 'fulfilled') {
          setDbUsers(usersResult.value.data);
        } else {
          console.error('Erro ao carregar utilizadores:', usersResult.reason);
        }

        if (modalDataResult.status === 'fulfilled') {
          setDbRooms(modalDataResult.value.roomAll);
          setDbCategories(modalDataResult.value.categoryAll);
        } else {
          console.error('Erro ao carregar dados do modal (salas/categorias):', modalDataResult.reason);
        }
      })
      .finally(() => setLoadingData(false));
  }, [isOpen]);

  return { dbUsers, dbRooms, dbCategories, loadingData };
}