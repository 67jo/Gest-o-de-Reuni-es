import z from "zod";


export const userSchema = z.object({
    name:z.string("Capo nome faltando"),
    email:z.string().email("Digite um email valido por favor"),
    password:z.string().min(8,"A password deve possuir no minimo 8 caraters")   
})

export const queryValidation = z.object({
    id:z.number().optional()
})