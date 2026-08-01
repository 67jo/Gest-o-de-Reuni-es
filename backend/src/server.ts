import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { 
  serializerCompiler, 
  validatorCompiler, 
  jsonSchemaTransform, 
  type ZodTypeProvider 
} from 'fastify-type-provider-zod'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { z } from 'zod'
import { SessionController } from "./controllers/SessionController.js"
import { UserController } from './controllers/UserController.js'
import { MeetingController } from './controllers/MeetingContoller.js'
import { SalaController } from './controllers/SalaController.js'

// --- ADICIONE ESTA IMPORTAÇÃO ---
import { db, setupDatabase } from './database.js' 

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: "http://localhost:5173", // URL do teu Frontend (React)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // PATCH tem de estar aqui!
  allowedHeaders: ['Content-Type', 'Authorization'],
});
app.register(jwt, { secret: 'Ds5678sD@' })

app.register(swagger, {
  openapi: {
    info: {
      title: 'Sistema de Gestão de Reuniões',
      description: 'API para agendamento e controle de reuniões',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(swaggerUi, { routePrefix: '/docs' })

// --- ATUALIZE SUA ROTA PARA SALVAR NO BANCO ---
app.post('/meetings', {
  schema: {
    body: z.object({
      title: z.string().min(3),
      description: z.string().optional(), // Adicionei para bater com o banco
      startTime: z.string().datetime(),    // Mudado de 'date' para bater com o banco
      endTime: z.string().datetime(),
      location: z.string()
    })
  }
}, async (request, reply) => {
  const { title, description, startTime, endTime, location } = request.body
  
  // Salvando no MySQL usando o Knex
  const [id] = await db('meetings').insert({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    title,
    description,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    location,
    status: 'Scheduled'
  })
  
  return reply.status(201).send({ message: 'Reunião criada no MySQL' })
})

// --- AJUSTE A INICIALIZAÇÃO ---
async function start() {
  try {
    // 1. Cria as tabelas se não existirem
    await setupDatabase() 
    
    // 2. Liga o servidor
    await app.listen({ port: 3333 })
    console.log('🚀 Backend rodando em http://localhost:3333')
    console.log('📖 Documentação disponível em http://localhost:3333/docs')
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err)
    process.exit(1)
  }
}

start()

//Rotas
app.post('/sessions', SessionController.create);
app.post('/register', UserController.register);
// app.get('/user-list', UserController.listAll);
app.post('/meeting-create', MeetingController.store);
app.get('/meeting-list', MeetingController.index);
app.put('/meeting-update/:id', MeetingController.update)
app.post('/salas', SalaController.store);
app.get('/salas', SalaController.index);
app.patch('/meeting-status/:id', MeetingController.patchStatus);