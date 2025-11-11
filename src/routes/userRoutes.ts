import { Router } from "express";
import { signInController, signUpController } from "../controllers/userControllers.js";

const userRouter: Router = Router();

userRouter.post("/signup",signUpController);

userRouter.post("/signin",signInController);

export default userRouter;