import { FastifyInstance } from "fastify";
import { RoomControler} from "../controllers/RoomController";
import authMiddleware from "../hooks/auth";



export const roomRoute = (app:FastifyInstance) =>{
   app.get("/room/list", 
    {preHandler:authMiddleware},
    RoomControler.getAll);         
}