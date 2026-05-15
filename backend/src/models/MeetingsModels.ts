import { db } from '../database.js';

export interface Meeting {
  id?: number;
  title: string;
  description: string;
  startTime: string; 
  endTime: string;
  status?: 'agendada' | 'decorrendo' | 'concluída' | 'cancelada';
  categoria: string;
  respondavel_id: number;
  sala_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export const MeetingModel = {
  // Criar nova reunião
  async create(data: Meeting) {
    // Garantimos que o status inicial seja sempre agendada se não vier nada
    const meetingData = { ...data, status: data.status || 'agendada' };
    return db('meetings').insert(meetingData);
  },

  // Listar reuniões com detalhes do responsável e da sala (Join CORRIGIDO)
  async findAll() {
    return await db('meetings')
      .join('users', 'meetings.respondavel_id', '=', 'users.id')
      // ALTERADO: de 'rooms' para 'salas' para bater com o teu DB
      .join('salas', 'meetings.sala_id', '=', 'salas.id') 
      .select(
        'meetings.*',
        'users.nome_completo as responsavel_nome',
        // ALTERADO: de 'rooms.name' para 'salas.nome'
        'salas.nome as sala_nome' 
      )
      .orderBy('meetings.created_at', 'desc');
  },

  // Buscar reuniões de um usuário específico
  async findByUser(userId: number) {
    return await db('meetings')
      .join('salas', 'meetings.sala_id', '=', 'salas.id')
      .where({ respondavel_id: userId })
      .select('meetings.*', 'salas.nome as sala_nome');
  },

  // Atualizar status (ex: Cancelar reunião)
  async updateStatus(id: number, status: 'agendada' | 'decorrendo' | 'concluída' | 'cancelada') {
    return await db('meetings')
      .where({ id })
      .update({ 
        status,
        updated_at: new Date() 
      });
  }
};