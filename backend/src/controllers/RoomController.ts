import { FastifyReply, FastifyRequest } from "fastify";
import { room } from "../models/RoomModel";


export const RoomControler = {
    getAll: async (req:FastifyRequest, res:FastifyReply)=>{
        const rooms = await room.findAll();

        return res.send(rooms);

    }
};