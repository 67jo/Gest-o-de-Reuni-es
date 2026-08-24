import { useEffect, useState } from 'react';
import { meetingServices } from '@/services/meeting.services';
import { userServices } from '@/services/user.services';
import type { category, room } from '@/types/meetings';

export interface MeetingUser {
  id: string;
  name: string;
  email: string;
}

interface UseMeetingModalDataResult {
  dbUsers: MeetingUser[];
  dbRooms: room[];
  dbCategories: category[];
  loadingData: boolean;
}

export function useMeetingModalData(isOpen: boolean): UseMeetingModalDataResult {
  const [dbUsers, setDbUsers] = useState<MeetingUser[]>([]);
  const [dbRooms, setDbRooms] = useState<room[]>([]);
  const [dbCategories, setDbCategories] = useState<category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingData(true);
    Promise.allSettled([
      userServices.findAll(),
      meetingServices.getMeetingModalData()
    ])
      .then(([usersResult, modalDataResult]) => {
        if (usersResult.status === 'fulfilled') {
          setDbUsers(usersResult.value);
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