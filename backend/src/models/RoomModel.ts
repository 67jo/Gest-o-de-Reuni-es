import { prisma } from "../config/prisma"


class Room{
    protected model = prisma.room

    async findAll(){
        return await this.model.findMany()
    }
    
}

export const room = new Room()