import { prisma } from "../config/prisma"
import { MeetingData } from "../types/meeting"

interface GetAllFilters {
    year?: number;
    month?: number; // 1-12
}

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

    async getAll(filters: GetAllFilters = {}){
        const where = filters.year !== undefined && filters.month !== undefined
            ? {
                date_start: {
                    gte: new Date(Date.UTC(filters.year, filters.month - 1, 1)),
                    lt: new Date(Date.UTC(filters.year, filters.month, 1))
                }
            }
            : {};

        return await this.model.findMany({ where })
    }
    
}

export const meeting = new Meeting()