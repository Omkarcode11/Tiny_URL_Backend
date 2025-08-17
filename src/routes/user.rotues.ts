import { UserController } from "../controllers/user.controller";
import express from "express";


const userRouter = express.Router();
const userController = UserController.getInstance();

userRouter.post("/", userController.createUser.bind(userController));
userRouter.get("/:id", userController.getUser.bind(userController));
userRouter.put("/:id", userController.updateUser.bind(userController));

export default userRouter;