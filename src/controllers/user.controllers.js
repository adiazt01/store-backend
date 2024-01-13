import { prisma } from "../app";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
	const { email, name, password } = req.body;

	// Check if the user already exists
	try {
		const foundUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (foundUser) {
			return res.status(400).json({
				message: "Email already registered",
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
		});
	}

	// Encrypt the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create the user
	try {
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});

		// Generate a token
		const token = jwt.sign(
			{
				id: user.id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		// Send the response
		res.cookie("token", token);
		return res.status(201).json({
			message: "User registered successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	// Check if the user exists
	try {
		const foundUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!foundUser) {
			return res.status(400).json({
				message: "Invalid credentials",
			});
		}

		// Check if the password is correct
		const isMatch = await bcrypt.compare(password, foundUser.password);
		if (!isMatch) {
			return res.status(400).json({
				message: "Invalid credentials",
			});
		}

		// Generate a token
		const token = jwt.sign(
			{
				id: foundUser.id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		// Send the response
		res.cookie("token", token);
		return res.status(200).json({
			message: "User logged successfully",
			user: foundUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error,
		});
	}
};
