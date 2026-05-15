import { db } from '../database.js';

export interface Sala {
  id?: number;
  nome: string;
  status?: 'disponível' | 'ocupada' | 'manutenção';
  capacidade: number; // Adicionar aqui
}
export const SalaModel = {
  // Listar todas as salas (para o select do Modal)
  async findAll() {
    return await db<Sala>('salas').select('*');
  },

  // Criar uma nova sala
  async create(data: Omit<Sala, 'id'>) {
    return await db('salas').insert(data);
  },

  // Buscar apenas as que estão disponíveis
  async findAvailable() {
    return await db<Sala>('salas').where({ status: 'disponível' }).select('*');
  },

  // Atualizar o status da sala (ex: mudar para ocupada)
  async updateStatus(id: number, status: string) {
    return await db('salas').where({ id }).update({ status });
  }
};