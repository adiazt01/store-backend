import { Router } from "express";
import { login, register } from "../controllers/user.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userLoginSchema, userRegisterSchema } from "../schemas/user.schema.js";

export const userRouter = Router();

userRouter.post("/register", validateSchema(userRegisterSchema), register);
userRouter.post("/login", validateSchema(userLoginSchema), login);
