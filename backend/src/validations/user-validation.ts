import z from "zod";


export const userSchema = z.object({
    name:z.string("Capo nome faltando"),
    email:z.string().email("Digite um email valido por favor"),
    password:z.string().min(8)   
})