import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
};
