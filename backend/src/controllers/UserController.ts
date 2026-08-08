import dotenv from "dotenv"
dotenv.config()

import { type FastifyRequest, type FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { userModel } from "../models/UserModels.js"
import { queryValidation, userSchema } from '../validations/user-validation.js';
import { prisma } from "../config/prisma.js";

export const UserController = {
  // Criar novo usuário (Sign Up)
  async register(req: FastifyRequest, res: FastifyReply) {
    const {name, email, password} = userSchema.parse(req.body)
    const salt_key = Number(process.env.SALT_KEY) 

    if(!salt_key) return

    const hashPass = await bcrypt.hash(password, salt_key)
    await userModel.create({name, email, password:hashPass})

    return res.send({msg:"criado com sucesso"})
  },
  async getById(req: FastifyRequest, res: FastifyReply){
   try{
     const { id } = req.user

    if(!id){
      return res.status(400).send({msg:"Indetificador não encontrado!"})
    }

    const user = await userModel.getById(id)

    if(!user){
      return res.status(400).send({msg:"Usuário não foi encontrado"})
    }

    return res.send(user)
   }catch(error){
      return res.status(401).send({msg:"Erro ao carrgar dados"})
   }
  }
  
};