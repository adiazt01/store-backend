import { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	searchProducts,
	updateProduct,
} from "../controllers/product.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
	newProductSchema,
	updateProductSchema,
} from "../schemas/product.schema.js";
import { validateToken } from "../middlewares/validate.token.js";

export const productRouter = Router();

productRouter.get("/", [validateToken], getAllProducts);
productRouter.get("/:id", [validateToken], getProduct);
productRouter.post(
	"/",
	[validateToken, validateSchema(newProductSchema)],
	createProduct,
);
productRouter.put(
	"/:id",
	[validateToken, validateSchema(updateProductSchema)],
	updateProduct,
);
productRouter.delete("/:id", [validateToken], deleteProduct);
