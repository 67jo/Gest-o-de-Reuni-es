import { FastifyRequest, FastifyReply } from "fastify";



async function authMiddleware(req:FastifyRequest, res:FastifyReply) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).send({msg:"Token não foi encontrado"})
    }

    try{
        await req.jwtVerify()
    }
    catch(error){
        return res.status(401).send({msg:"Usuário não autorizado"})
    }

}

export default authMiddleware;