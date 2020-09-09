import express from "express";
import { UserController} from "../controllers/UserController";

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login)