import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";
import authMiddleware from "../hooks/auth";

export const userRoutes = (app:FastifyInstance) => {
    app.post("/register", UserController.register);
    app.post("/session", SessionController.create);

    app.get("/me",
         { preHandler:authMiddleware },
         UserController.getById
        )
}