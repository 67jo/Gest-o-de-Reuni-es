import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";

export const userRoutes = (app:FastifyInstance) => {
    app.post("/register", UserController.register)
}