import { app } from "../app";
import request from "supertest";
import { prisma } from "../app";

const userTest = {
  name: "Test User",
  email: "test@mail.com",
  password: "123456",
  confirmPassword: "123456",
};

const productTest = {
  name: "Product Test",
  description: "Product Test Description",
  price: 9.99,
};

let token = "";

beforeAll(async () => {
  const user = await prisma.user.findUnique({
    where: { email: userTest.email },
  });

  if (user) {
    const { id } = user;

    await prisma.sell.deleteMany({ where: { userId: user.id } });

    // Delete the products associated with the user
    await prisma.product.deleteMany({ where: { userId: user.id } });

    // Now you can delete the user
    await prisma.user.delete({ where: { id: id } });
  }

  const response = await request(app).post("/api/auth/register").send({
    name: userTest.name,
    email: userTest.email,
    password: userTest.password,
    confirmPassword: userTest.confirmPassword,
  });

  const cookies = response.headers["set-cookie"];
  token = cookies[0].split(";")[0].replace("token=", "");
});

afterAll(async () => {
  const user = await prisma.user.findUnique({
    where: { email: userTest.email },
  });

  const { id } = user;

  await prisma.sell.deleteMany({ where: { userId: user.id } });

  // Delete the products associated with the user
  await prisma.product.deleteMany({ where: { userId: user.id } });

  // Now you can delete the user
  await prisma.user.delete({ where: { id: id } });
});

describe("GET /api/sells", () => {
  test("should return all sells", async () => {
    const response = await request(app)
      .get("/api/sells")
      .set("Cookie", [`token=${token}`]);
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("sells");
  });
});

describe("POST /api/sells", () => {
  test("should create a new sell and get by his id", async () => {
    const responseProduct = await request(app)
      .post("/api/products")
      .set("Cookie", [`token=${token}`])
      .send({
        name: productTest.name,
        description: productTest.description,
        price: productTest.price,
      });

    const response = await request(app)
      .post("/api/sells")
      .set("Cookie", [`token=${token}`])
      .send({
        productId: responseProduct.body.product.id,
        quantity: 2,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Sell created successfully");

    const sellId = response.body.sell.id;
    const responseGet = await request(app)
      .get(`/api/sells/${sellId}`)
      .set("Cookie", [`token=${token}`]);

    expect(responseGet.statusCode).toBe(200);
    expect(responseGet.body).toHaveProperty("sell");
    expect(responseGet.body.sell).toHaveProperty("id");
    expect(responseGet.body.sell).toHaveProperty("quantity");
    expect(responseGet.body.sell).toHaveProperty("productId");
    expect(responseGet.body.sell).toHaveProperty("userId");
  });
});

