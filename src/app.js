import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";

export const prisma = new PrismaClient();

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
	cors({
		origin: "http://localhost:3001",
		credentials: true,
	}),
);

app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
