import { type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';
import { SalaModel } from '../models/SalaModel.js';
import { db } from '../database.js';


export const SalaController = {
  // Criar nova sala (POST /salas)
  async store(request: FastifyRequest, reply: FastifyReply) {
    try {
      const salaSchema = z.object({
        nome: z.string().min(3),
        capacidade: z.number().min(1, "A capacidade deve ser pelo menos 1"), // Adicionar aqui
        status: z.enum(['disponível', 'ocupada', 'manutenção']).default('disponível')
      });

      const data = salaSchema.parse(request.body);

      const [id] = await SalaModel.create(data);

      return reply.status(201).send({ 
        message: 'Sala cadastrada com sucesso!', 
        id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(error.flatten().fieldErrors);
      }
      return reply.status(500).send({ message: 'Erro ao criar sala' });
    }
  },

  // Listar salas (GET /salas)
  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const salas = await SalaModel.findAll();
      
      // Pegamos o horário atual formatado para o MySQL
      const now = new Date().toLocaleString("sv-SE", { timeZone: "Africa/Luanda" });

      // Mapeamos as salas para calcular o status em tempo real
      const salasComStatusReal = await Promise.all(salas.map(async (sala) => {
        // Se a sala estiver em manutenção, mantemos esse status fixo
        if (sala.status === 'manutenção') return sala;

        // Verificamos se existe uma reunião AGORA nesta sala
        const reuniaoAtiva = await db('meetings')
          .where('sala_id', sala.id)
          .where('status', 'decorrendo') // Apenas reuniões não canceladas/concluídas
          .where('startTime', '<=', now)
          .where('endTime', '>=', now)
          .first();

        return {
          ...sala,
          // Se houver reunião ativa, o status é 'ocupada', caso contrário 'disponível'
          status: reuniaoAtiva ? 'ocupada' : 'disponível'
        };
      }));

      return reply.send(salasComStatusReal);
    } catch (error) {
      console.error("❌ Erro ao buscar salas:", error);
      return reply.status(500).send({ message: 'Erro ao buscar salas' });
    }
  }
};