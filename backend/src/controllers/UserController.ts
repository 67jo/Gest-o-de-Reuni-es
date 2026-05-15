import { type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/UserModels.js';
import { db } from '../database.js';

export const UserController = {
  // Criar novo usuário (Sign Up)
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userSchema = z.object({
        nome_completo: z.string().min(3),
        numero: z.number(),
        email: z.string().email(),
        password: z.string().min(6),
        departamento: z.string()
      });

      const data = userSchema.parse(request.body);

      // Verificar se o email já existe
      const userExists = await UserModel.findByEmail(data.email);
      if (userExists) {
        return reply.status(400).send({ message: 'Este e-mail já está em uso.' });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(data.password, 8);

      // Salvar no Banco
      await UserModel.create({
        ...data,
        password: hashedPassword
      });

      return reply.status(201).send({ message: 'Usuário criado com sucesso!' });

    } catch (error: any) {
      console.error("❌ Erro no Registro:", error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send(error.flatten().fieldErrors);
      }
      return reply.status(500).send({ message: 'Erro interno no servidor' });
    }
  },

  // Listar todos os usuários (útil para o Modal de Nova Reunião)
  async listAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      // 2. Use o 'db' diretamente, não através do 'UserModel'
      const users = await db('users')
        .select('id', 'nome_completo', 'departamento', 'email');
        
      return reply.send(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return reply.status(500).send({ message: 'Erro ao buscar usuários' });
    }
  }
};