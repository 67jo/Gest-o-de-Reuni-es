import { prisma } from "../config/prisma"
import { MeetingData } from "../types/meeting"
import type { Prisma } from "@prisma/client"

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
        const where: Prisma.MeetingWhereInput = {};

        if (filters.year !== undefined && filters.month !== undefined) {
            const start = new Date(Date.UTC(filters.year, filters.month - 1, 1));
            const end = new Date(Date.UTC(filters.year, filters.month, 1));
            where.date_start = { gte: start, lt: end };
        }

        return await this.model.findMany({ where })
    }
    
}

export const meeting = new Meeting()