import { prisma } from "../config/prisma"

class User {
 async create(data:UserType){
    return await prisma.user.create({
      data:{
        ...data
      },select:{
        id:true,
        name:true,
        email:true
      }
    })
  }
}

export const user = new User()