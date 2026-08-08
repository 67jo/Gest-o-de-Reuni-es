// types/fastify-jwt.d.ts — necessário pra req.user.id ter tipo correto
import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number, email:string };
    user: { id: number };
  }
}