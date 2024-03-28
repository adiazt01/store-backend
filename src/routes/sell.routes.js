import { Router } from "express";
import { createSell, deleteSell, getSellById, getSells, updateSell } from "../controllers/sell.controllers.js";
import { validateToken } from "../middlewares/validate.token.js";

export const sellRouter = Router();

sellRouter.get("/", [validateToken],getSells);
sellRouter.get("/:id", [validateToken],getSellById);
sellRouter.post("/", [validateToken], createSell);
sellRouter.put("/:id",[validateToken], updateSell);
sellRouter.delete("/:id",[validateToken], deleteSell);