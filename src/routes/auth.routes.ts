import { AuthController } from "../controllers/auth.controller";
import express from "express";

const authRouter = express.Router();
const authController = AuthController.getInstance();

authRouter.post("/signin", authController.signIn.bind(authController));
authRouter.post("/signup", authController.signUp.bind(authController));

export default authRouter;