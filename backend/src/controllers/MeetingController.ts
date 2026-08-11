import { FastifyReply, FastifyRequest } from "fastify";
import { meeting } from "../models/MeetingModels";
import { meetingValidation } from "../validations/meeting-validation";
import { room } from "../models/RoomModel";
import { category } from "../models/CategoryModel";

export const MeetingControler = {
    create :async (req:FastifyRequest, res:FastifyReply) =>{
        const {title, category, room, responsible, n_participants, date_end, date_start, status} = meetingValidation.meetingData.parse(req.body);

        meeting.create({title, category,room, responsible_id:responsible, n_participants, date_end, date_start, status})
        return res.send({msg:"criado com sucesso"})
    },
    getMeetingModalData: async (req:FastifyRequest, res:FastifyReply) =>{
        const categoryAll = await category.findAll()
        const roomAll = await room.findAll()

       return  res.send({
            categoryAll,
            roomAll
        })
    }
}