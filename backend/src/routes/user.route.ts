import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";

export const userRoutes = (app:FastifyInstance) => {
    app.post("/register", UserController.register);
    app.post("/session", SessionController.create);
}