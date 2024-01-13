import { Router } from "express";
import { login, register } from "../controllers/user.controllers";
import { validateSchema } from "../middlewares/validateSchema";
import { userLoginSchema, userRegisterSchema } from "../schemas/user.schema";

export const userRouter = Router();

userRouter.post("/register", validateSchema(userRegisterSchema), register);
userRouter.post("/login", validateSchema(userLoginSchema), login);
