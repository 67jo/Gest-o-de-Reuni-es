import { FastifyInstance } from "fastify";
import { MeetingControler } from "../controllers/MeetingController";
import authMiddleware from "../hooks/auth";



export const meetingRoute = (app:FastifyInstance) =>{
    app.post("/create",
         {preHandler:authMiddleware},
          MeetingControler.create)
          
    app.get("/modal-data",
         {preHandler:authMiddleware},
          MeetingControler.getMeetingModalData) 
}