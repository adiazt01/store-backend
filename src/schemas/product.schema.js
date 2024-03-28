import { z } from "zod";

export const newProductSchema = z.object({
	name: z.string({ required_error: "Name is required" }),
	price: z.number({ required_error: "Price is required" }),
});

export const updateProductSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.number().optional(),
});
