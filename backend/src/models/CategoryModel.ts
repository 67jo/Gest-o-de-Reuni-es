import { prisma } from "../config/prisma"


class Category{
    protected model = prisma.category

    async findAll(){
        return await this.model.findMany()
    }
    
}

export const category = new Category()