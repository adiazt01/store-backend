export const validateSchema = (schema) => async (req, res, next) => {
	try {
		const validatedBody = schema.parse(req.body);
		req.body = validatedBody;
		next();
	} catch (error) {
		return res.status(400).json({
			message: error.errors.map((err) => err.message),
		});
	}
};
