import { db } from '../database.js'

export interface User {
  id?: number; // No MySQL 5.6 com increments, o ID é number
  nome_completo: string;
  numero: number;
  email: string;
  password?: string;
  departamento: string;
}

export const UserModel = {
  // Buscar por email (usado no Login)
  async findByEmail(email: string) {
    return await db<User>('users').where({ email }).first();
  },

  // Criar novo usuário (usado no Cadastro)
  async create(userData: Omit<User, 'id'>) {
    return await db('users').insert(userData);
  },

  // Buscar por ID (usado para perfis ou validação de token)
  async findById(id: number) {
    return await db<User>('users').where({ id }).first();
  }
};