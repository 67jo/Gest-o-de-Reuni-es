import { prisma } from "../config/prisma";

class User {
  protected model = prisma.user
 async create(data:UserType){
    return await this.model.create({
      data:{
        ...data
      },select:{
        id:true,
        name:true,
        email:true,
      }
    })
  }
  async getByEmail(email:string){
    return await this.model.findFirst({
      where:{email}
    });    
  }

  async getById(id:number){
    return await this.model.findUnique({
      where:{id},
      select:{
        id:true,
        name:true,
        email:true
      }
    })
  }
}

export const userModel = new User()