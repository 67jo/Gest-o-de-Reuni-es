import "dotenv/config"
import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import { userRoutes } from "./routes/user.route"



export function createApp(){
  const app = Fastify({
    logger:true
  })

  app.register(cors,{
    origin:true
  })

  app.register(jwt,{
    secret:process.env.SECRET_JWT || "SECRET"
  })

  app.register(userRoutes,{
    prefix:"/user"
  })

  return app
}