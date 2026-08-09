import { prisma } from "../config/prisma"


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
    
}

export const meeting = new Meeting()