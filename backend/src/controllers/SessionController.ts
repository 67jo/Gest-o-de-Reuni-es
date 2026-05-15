import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserModel } from '../models/UserModels.js'

export const SessionController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    console.log("--- INÍCIO DA TENTATIVA DE LOGIN ---");
    console.log("Corpo da requisição:", request.body);

    try {
      // 1. Validação com Zod
      const sessionSchema = z.object({
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "Senha muito curta")
      });

      const { email, password } = sessionSchema.parse(request.body);
      console.log("Validação Zod: OK");

      // 2. Busca no MySQL
      console.log("Buscando usuário no MySQL...");
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        console.warn(`Aviso: Usuário [${email}] não encontrado no banco.`);
        return reply.status(401).send({ message: 'E-mail ou senha inválidos' });
      }
      console.log("Usuário encontrado: OK");

      // 3. Verificação de Senha
      if (user.password !== password) {
        console.warn(`Aviso: Senha incorreta para o usuário [${email}].`);
        return reply.status(401).send({ message: 'E-mail ou senha inválidos' });
      }
      console.log("Verificação de senha: OK");

      // 4. Geração de Token JWT
      console.log("Tentando assinar o Token JWT...");
      if (!request.server.jwt) {
        throw new Error("O plugin Fastify-JWT não foi registrado no server.ts!");
      }

      const userID = String(user.id)

      const token = request.server.jwt.sign(
        { name: user.nome_completo }, 
        {
          sub: userID,
          expiresIn: '7d'
        }
      );
      console.log("Token gerado: OK");
      console.log("[200] login feito com sucesso!!");
      console.log("--- LOGIN FINALIZADO COM SUCESSO ---");
      
      return reply.send({
        user: {
          id: user.id,
          name: user.nome_completo,
          email: user.email
        },
        token
      });

    } catch (error: any) {
      // --- CAPTURA DE ERROS CRÍTICOS ---
      console.error("❌ ERRO NO CONTROLLER:");
      
      // Se o erro for do Zod (validação de campos)
      if (error instanceof z.ZodError) {
        console.error("Erro de Validação:", error.flatten().fieldErrors);
        return reply.status(400).send({ 
          message: 'Dados inválidos', 
          errors: error.flatten().fieldErrors 
        });
      }

      // Erro de Banco de Dados ou JWT
      console.error("Mensagem do Erro:", error.message);
      console.error("Stack Trace:", error.stack);

      return reply.status(500).send({ 
        message: 'Erro interno no servidor',
        error: error.message // Mostra o erro pro frontend pra você ver no navegador
      });
    }
  }
}