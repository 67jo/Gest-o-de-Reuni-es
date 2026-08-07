import z from "zod"

class SessionValidator{
    sessionData = z.object({
        email:z.string().email("Digite um email valido por favor"),
        password:z.string(),
    })
}

export const sessionValidator = new SessionValidator()