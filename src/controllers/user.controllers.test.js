import request from "supertest";
import bcrypt from "bcryptjs";
import { app, prisma } from "../app";

const userTest = {
  name: "Test User",
  email: "test@mail.com",
  password: "123456",
  confirmPassword: "123456",
};

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
});

afterAll(async () => {
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
});

describe("POST api/auth/register", () => {
  test("should return 400 if fields is empty o invalid", async () => {
    const response = await request(app).post("/api/auth/register").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return a message if passwords do not match", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...userTest, confirmPassword: "1234567" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Passwords do not match");
  });

  test("should return a message if email is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...userTest, email: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Invalid email address");
  });

  test("should return a message if email is already registered", async () => {
    await prisma.user.create({
      data: {
        name: userTest.name,
        email: userTest.email,
        password: await bcrypt.hash(userTest.password, 10),
      },
    });
    const response = await request(app)
      .post("/api/auth/register")
      .send(userTest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Email already registered");
  });

  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userTest);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("User registered successfully");
  });

  test("should return a token", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userTest);

    expect(response.statusCode).toBe(201);
    expect(response.headers).toHaveProperty("set-cookie");
  });
});

describe("POST api/auth/login", () => {
  test("should return 400 if email is not found", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@mail.com", password: "123456" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  test("should return 400 if password is incorrect", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userTest.email, password: "incorrectpassword" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  test("should return a token and user data if login is successful", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userTest.email, password: userTest.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User logged successfully");
    expect(response.body).toHaveProperty("user");
    expect(response.headers).toHaveProperty("set-cookie");
  });
});
