import { prisma } from "../config/prisma"
import { MeetingData } from "../types/meeting"


class Meeting{
    protected model = prisma.meeting

    async create(data:MeetingData){
        return await this.model.create({
            data:{
                ...data
            },select:{ 
                id:true,
                title:true,
                category:true,
                room:true,
                n_participants:true,
                responsible:true,
                date_start:true,
                date_end:true
            }
        })
    }

    async getAll(){
        return await this.model.findMany()
    }
    
}

export const meeting = new Meeting()