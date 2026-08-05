import dotenv from "dotenv"
dotenv.config()

import { type FastifyRequest, type FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { user } from "../models/UserModels.js"
import { userSchema } from '../validations/user-validation.js';

export const UserController = {
  // Criar novo usuário (Sign Up)
  async register(req: FastifyRequest, res: FastifyReply) {
    const {name, email, password} = userSchema.parse(req.body)
    const salt_key = Number(process.env.SALT_KEY) 

    if(!salt_key) return

    const hashPass = await bcrypt.hash(password, salt_key)
    await user.create({name, email, password:hashPass})

    return res.send({msg:"criado com sucesso"})
  },

  
};