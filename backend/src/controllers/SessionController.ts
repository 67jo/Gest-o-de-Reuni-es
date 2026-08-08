import { type FastifyRequest, type FastifyReply } from 'fastify';
import { sessionValidator } from '../validations/session-validation';
import { createApp } from '../app';
import { userModel } from '../models/UserModels';
import bcrypt from 'bcryptjs';


export const SessionController = {
  async create(req: FastifyRequest, res: FastifyReply) {
    try{
      const { email, password } = sessionValidator.sessionData.parse(req.body);
      const user = await userModel.getByEmail(email);

      if(!user){
        return res.status(404).send({msg:"O usuário não foi encontrado"});
      } 

      const id = user.id;
      const passValidated = await bcrypt.compare(password, user.password)

      if(!passValidated){
        return res.status(400).send({msg:"Credencias Invalidas!"})
      }

      const jwt_token = req.server.jwt.sign({id, email});

      res.setCookie("token",jwt_token,{
        path:"/",
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:'strict',
        signed:true
      });

     return res.send({
        msg:`Bem vindo, ${user.name}`,
        data:{
          id:user.id,
          name:user.name,
          email:user.email
        }
      });
    }catch(erro){
      req.log.error(erro);
      return res.status(500).send({msg:"Erro interno ao autenticar"});
    }
    
  }
}