import { FastifyInstance } from "fastify";
import { MeetingControler } from "../controllers/MeetingController";



export const meetingRoute = (app:FastifyInstance) =>{
    app.post("/create", MeetingControler.create)
    app.get("/modal-data", MeetingControler.getMeetingModalData) 
}