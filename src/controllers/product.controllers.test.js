import { app } from "../app";
import request from "supertest";
import { prisma } from "../app";

const userTest = {
	name: "Test User",
	email: "test@mail.com",
	password: "123456",
	confirmPassword: "123456",
};

let token = "";

beforeAll(async () => {
	const response = await request(app).post("/api/auth/register").send({
		name: userTest.name,
		email: userTest.email,
		password: userTest.password,
		confirmPassword: userTest.confirmPassword,
	});

	const cookies = response.headers["set-cookie"];
	token = cookies[0].split(";")[0].replace("token=", "");
});



describe("POST /api/products", () => {
	test("should create a new product and get by his id", async () => {
		const response = await request(app)
			.post("/api/products")
			.set("Cookie", [`token=${token}`])
			.send({
				name: "Product Test",
				description: "Product Test Description",
				price: 9.99,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("message");
		expect(response.body.message).toContain("Product created successfully");

		const productId = response.body.product.id;

		const response2 = await request(app)
			.get(`/api/products/${productId}`)
			.set("Cookie", [`token=${token}`]);
		expect(response2.statusCode).toBe(200);
		expect(response2.body).toHaveProperty("product");
		expect(response2.body.product).toHaveProperty("name");
		expect(response2.body.product).toHaveProperty("description");
	});
});

describe("GET /api/products", () => {
	test("should return all products", async () => {
		const response = await request(app)
			.get("/api/products")
			.set("Cookie", [`token=${token}`]);;
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("products");
	});
});