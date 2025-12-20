import userController from "../controllers/user.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const userRouter = Router();

userRouter.get("/me", verifyJWT, userController.getMe);

export default userRouter;

