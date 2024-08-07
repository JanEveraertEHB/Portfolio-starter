const request = require("supertest");
const app = require("../../app.js");
const knexConfig = require("../../db/knexfile.js");
const db = require("knex")(knexConfig.development);
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/**
 * Integration tests for the POST /users/login endpoint.
 */
describe("POST /users/login", () => {
  let testUser;

  /**
   * Setup test data before running the tests.
   * This includes starting a transaction, hashing a password, and inserting a test user into the database.
   */
  beforeAll(async () => {
    await db.raw("BEGIN"); // Start transaction
    const hashedPassword = await bcrypt.hash("valid_password", 10);
    testUser = {
      UUID: uuidv4(),
      username: "test_user",
      password_hash: hashedPassword,
      role: "member",
    };
    await db("Users").insert(testUser);
    await db.raw("COMMIT"); // Commit transaction
  });

  /**
   * Cleanup test data after running the tests.
   * This includes truncating the Users table and destroying the database connection.
   */
  afterAll(async () => {
    await db.raw('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE');
    await db.destroy(); // Destroy connection
  });

  /**
   * Test case for successful login with valid credentials.
   * Expects a 200 status code and a response body containing a success message and user details.
   */
  test("should login successfully with valid credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "test_user", password: "valid_password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("username", "test_user");
  });

  /**
   * Test case for failed login with invalid credentials.
   * Expects a 401 status code and a response body containing an error message.
   */
  test("should fail to login with invalid credentials", async () => {
    const response = await request(app)
      .post(`/api/users/login`)
      .send({ username: "test_user", password: "invalid_password" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  /**
   * Test case for failed login with missing username.
   * Expects a 400 status code and a response body containing an error message.
   */
  test("should fail to login with missing username", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ password: "valid_password" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Username is required");
  });

  /**
   * Test case for failed login with missing password.
   * Expects a 400 status code and a response body containing an error message.
   */
  test("should fail to login with missing password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "test_user" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Password is required");
  });

  /**
   * Test case for failed login with non-existent user.
   * Expects a 401 status code and a response body containing an error message.
   */
  test("should fail to login with non-existent user", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "non_existent_user", password: "valid_password" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  /**
   * Test case for failed login with empty request body.
   * Expects a 400 status code and a response body containing an error message.
   */
  test("should fail to login with empty request body", async () => {
    const response = await request(app).post("/api/users/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username and password are required"
    );
  });
});
