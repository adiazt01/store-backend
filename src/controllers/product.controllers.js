import { prisma } from "../app";

export const getAllProducts = async (req, res) => {
	const { userId } = req;
	try {
		const products = await prisma.product.findMany({
			where: {
				userId: userId,
			},
		});
		return res.status(200).json({
			products,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const searchProducts = async (req, res) => {
	const { name } = req.query;
	try {
		const products = await prisma.product.findMany({
			where: {
				name: {
					contains: name,
					mode: "insensitive",
				},
			},
		});
		return res.status(200).json({
			products,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const getProduct = async (req, res) => {
	const { id } = req.params;
	const { userId } = req;
	try {
		const product = await prisma.product.findUnique({
			where: {
				id: id,
				userId: userId,
			},
		});
		if (!product) {
			return res.status(404).json({
				message: "Product not found",
			});
		}
		return res.status(200).json({
			product,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const createProduct = async (req, res) => {
	const { name, description, price } = req.body;
	const { userId } = req;
	try {
		const product = await prisma.product.create({
			data: {
				name,
				description,
				price,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
		return res.status(201).json({
			message: "Product created successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, description, price } = req.body;
	try {
		const product = await prisma.product.update({
			where: {
				id: id,
			},
			data: {
				name,
				description,
				price,
			},
		});
		return res.status(200).json({
			message: "Product updated successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await prisma.product.delete({
			where: {
				id: parseInt(id),
			},
		});
		return res.status(200).json({
			message: "Product deleted successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};
