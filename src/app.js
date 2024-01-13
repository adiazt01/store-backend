import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./routes/user.routes";
import { productRouter } from "./routes/product.routes";

export const prisma = new PrismaClient();

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
