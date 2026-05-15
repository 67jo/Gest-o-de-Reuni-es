import { type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../database.js';
import { MeetingModel } from '../models/MeetingsModels.js';
import { type Meeting } from '../models/MeetingsModels.js';

/**
 * Utilitário para formatar datas para o padrão MySQL 5.6
 */
const formatToMysql = (dateStr: string | any): string => {
  if (!dateStr) return ''; 
  return dateStr.replace('T', ' ').replace('Z', '').split('.')[0];
};

const meetingSchema = z.object({
  title: z.string().min(3),
  description: z.string().default(''),
  startTime: z.string(),
  endTime: z.string(),
  categoria: z.string(),
  sala_id: z.coerce.number(),
  respondavel_id: z.coerce.number()
});

export const MeetingController = {
  async store(request: FastifyRequest, reply: FastifyReply) {
    console.log("📥 [DEBUG] Payload recebido:", request.body);

    try {
      const data = meetingSchema.parse(request.body);
      
      const start = formatToMysql(data.startTime);
      const end = formatToMysql(data.endTime);

      // --- VALIDAÇÃO DE CONFLITO ---
      // Verifica se a sala está ocupada, ignorando reuniões canceladas
      const conflict = await db('meetings')
        .where('sala_id', data.sala_id)
        .where('status', '!=', 'cancelada') 
        .where('startTime', '<', end)
        .where('endTime', '>', start)
        .first();

      if (conflict) {
        console.warn("⚠️ [DEBUG] Conflito detectado com a reunião:", conflict.id);
        return reply.status(400).send({ 
          message: 'A sala ou o intervalo de tempo selecionado já está ocupado.' 
        });
      }

      const meetingToCreate: Meeting = {
        title: data.title,
        description: data.description,
        categoria: data.categoria,
        sala_id: data.sala_id,
        respondavel_id: data.respondavel_id,
        startTime: start,
        endTime: end,
        status: 'agendada' // Status inicial padrão
      };

      await MeetingModel.create(meetingToCreate);
      
      console.log("✅ [201] Reunião criada com sucesso!");
      return reply.status(201).send({ message: 'Sucesso!' });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("❌ [DEBUG] Erro de Validação:", error.flatten().fieldErrors);
        return reply.status(400).send({ details: error.flatten().fieldErrors });
      }

      console.error("❌ [DEBUG] Erro ao salvar:", error);
      return reply.status(500).send({ 
        message: 'Erro interno ao agendar.',
        details: error.message 
      });
    }
  },

  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const meetings = await MeetingModel.findAll();
      const now = new Date();
  
      const meetingsWithDynamicStatus = await Promise.all(meetings.map(async (m) => {
        // Só atualizamos automaticamente se estiver 'agendada' ou 'decorrendo'
        // Reuniões 'canceladas' ou 'concluídas' não devem mudar sozinhas
        if (m.status !== 'agendada' && m.status !== 'decorrendo') return m;
  
        const startTime = new Date(m.startTime);
        const endTime = new Date(m.endTime);
        const nowTime = now.getTime();
  
        let novoStatus = m.status;
  
        // Lógica: Se passou do fim -> concluída
        if (nowTime > endTime.getTime()) {
          novoStatus = 'concluída';
        } 
        // Lógica: Se está entre o início e o fim -> decorrendo
        else if (nowTime >= startTime.getTime() && nowTime <= endTime.getTime()) {
          novoStatus = 'decorrendo';
        }
  
        // Se o status mudou, atualiza no banco
        if (novoStatus !== m.status) {
          await MeetingModel.updateStatus(m.id!, novoStatus);
          return { ...m, status: novoStatus };
        }
  
        return m;
      }));
  
      // ORDENAÇÃO: Garante que o mais recente criado apareça no topo
      // Nota: Usei 'created_at' pois é como está no seu Model/Interface
      const sortedMeetings = meetingsWithDynamicStatus.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
  
      return reply.send(sortedMeetings);
  
    } catch (error: any) {
      console.error("❌ [DEBUG] Erro ao listar:", error.message);
      return reply.status(500).send({ message: 'Erro ao listar reuniões.' });
    }
  },  async patchStatus(request: FastifyRequest, reply: FastifyReply) {
    // 1. O ID vem dos PARAMS (URL), o Status vem do BODY
    const paramsSchema = z.object({ id: z.coerce.number() });
    const bodySchema = z.object({ status: z.enum(['agendada', 'decorrendo', 'concluída', 'cancelada']) });

    try {
      // Validar os dois separadamente
      const { id } = paramsSchema.parse(request.params);
      const { status } = bodySchema.parse(request.body);

      console.log(`\n🔍 [INVESTIGAÇÃO] Reunião ID: ${id} | Novo Status: ${status}`);

      // 1. Verificar se a reunião existe
      const meeting = await db('meetings').where({ id }).first();
      if (!meeting) {
        console.error("❌ Reunião não encontrada");
        return reply.status(404).send({ message: 'Reunião não encontrada.' });
      }

      // 2. Executar a atualização no Model
      const rowsAffected = await MeetingModel.updateStatus(id, status);

      if (rowsAffected === 0) {
        return reply.status(500).send({ message: 'Erro ao atualizar no banco.' });
      }

      console.log(`✅ Sucesso! Linhas afetadas: ${rowsAffected}`);
      return reply.send({ message: `Status alterado para ${status}` });

    } catch (error: any) {
      console.error("🚨 Erro:", error.message);
      return reply.status(400).send({ message: 'Dados inválidos.' });
    }
  },
  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.coerce.number() });

    try {
      // 1. Pega o ID da URL e os dados do Body
      const { id } = paramsSchema.parse(request.params);
      const data = meetingSchema.parse(request.body);
      
      const start = formatToMysql(data.startTime);
      const end = formatToMysql(data.endTime);

      console.log(`📥 [DEBUG] Tentando atualizar reunião ID: ${id}`);

      // 2. Verifica se a reunião existe
      const existingMeeting = await db('meetings').where({ id }).first();
      if (!existingMeeting) {
        return reply.status(404).send({ message: 'Reunião não encontrada.' });
      }

      // 3. --- VALIDAÇÃO DE CONFLITO ---
      // Verifica se a sala está ocupada por OUTRA reunião
      const conflict = await db('meetings')
        .where('sala_id', data.sala_id)
        .where('status', '!=', 'cancelada') 
        .where('id', '!=', id) // <-- CRUCIAL: Ignora a própria reunião na checagem
        .where('startTime', '<', end)
        .where('endTime', '>', start)
        .first();

      if (conflict) {
        console.warn("⚠️ [DEBUG] Conflito detectado com a reunião:", conflict.id);
        return reply.status(400).send({ 
          message: 'A sala ou o intervalo de tempo selecionado já está ocupado por outra reunião.' 
        });
      }

      // 4. Executa a atualização
      // Nota: Certifique-se de que o seu MeetingModel tenha um método `update` ou use o db() diretamente
      const dataToUpdate = {
        title: data.title,
        description: data.description,
        categoria: data.categoria,
        sala_id: data.sala_id,
        respondavel_id: data.respondavel_id,
        startTime: start,
        endTime: end
      };

      // Exemplo usando o query builder direto (ou substitua por MeetingModel.update se você já tiver criado no model)
      await db('meetings').where({ id }).update(dataToUpdate);
      
      console.log("✅ [200] Reunião atualizada com sucesso!");
      return reply.status(200).send({ message: 'Reunião atualizada com sucesso!' });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("❌ [DEBUG] Erro de Validação no Update:", error.flatten().fieldErrors);
        return reply.status(400).send({ details: error.flatten().fieldErrors });
      }

      console.error("❌ [DEBUG] Erro ao atualizar:", error);
      return reply.status(500).send({ 
        message: 'Erro interno ao atualizar a reunião.',
        details: error.message 
      });
    }
  },
};