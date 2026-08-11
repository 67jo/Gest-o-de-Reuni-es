import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { userRoutes } from "./routes/user.route";
import cookie from "@fastify/cookie";
import { meetingRoute } from "./routes/meeting.route";


export function createApp(){
  const app = Fastify({
    logger:true
  })

   app.register(cors,{
    origin:true,
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
  })


  app.register(cookie, {
    secret: process.env.COOKIE_SECRET || "COOKIE_SECRET"
  })

  app.register(jwt,{
    secret:process.env.SECRET_JWT || "SECRET",
    cookie:{
      cookieName:"token",
      signed:true
    }
  })

  app.register(userRoutes,{
    prefix:"/user"
  })

  app.register(meetingRoute, {
    prefix:"/meeting"
  })

  return app
}