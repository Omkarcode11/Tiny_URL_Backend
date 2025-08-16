import { UserController } from "../controllers/user.controller";
import express from "express";


const userRouter = express.Router();
const userController = UserController.getInstance();

userRouter.post("/v1/users", userController.createUser.bind(userController));
userRouter.get("/v1/users/:id", userController.getUser.bind(userController));
userRouter.put("/v1/users/:id", userController.updateUser.bind(userController));

export default userRouter;