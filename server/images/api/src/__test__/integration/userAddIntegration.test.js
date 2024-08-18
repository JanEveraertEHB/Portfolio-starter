const request = require("supertest");
const app = require("../../app.js");
const knexConfig = require("../../db/knexfile.js");
const db = require("knex")(knexConfig.development);
const { v4: uuid } = require("uuid");

const exampleUser = {
  UUID: uuid(),
  username: "admin",
  password: "password",
  role: "member",
};

/**
 * Integration tests for the /users endpoint (POST)
 */
describe("POST /users", () => {
  /**
   * Setup test data before running the tests.
   * This includes starting a transaction.
   */
  beforeAll(async () => {
    await db.raw("BEGIN");
  });

  /**
   * Cleanup test data after running the tests.
   * This includes destroying the database connection.
   */
  afterAll(async () => {
    await db.destroy();
  });

  /**
   * Test case for creating a user with valid data
   */
  test("should return user information for a valid user", async () => {
    const response = await request(app).post(`/api/users`).send(exampleUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("UUID");
    expect(response.body).toHaveProperty("username", exampleUser.username);
    expect(response.body).toHaveProperty("role", exampleUser.role);
  });

  /**
   * Test case for creating a user with missing username
   */
  test("should return 400 if username is missing", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, username: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username, password, and role are required"
    );
  });

  /**
   * Test case for creating a user with missing password
   */
  test("should return 400 if password is missing", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, password: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username, password, and role are required"
    );
  });

  /**
   * Test case for creating a user with missing role
   */
  test("should return 400 if role is missing", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, role: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username, password, and role are required"
    );
  });

  /**
   * Test case for creating a user with too long username
   */
  test("should return 400 if username is too long", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, username: "a".repeat(21) });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username must be at most 20 characters and password at most 30 characters"
    );
  });

  /**
   * Test case for creating a user with too long password
   */
  test("should return 400 if password is too long", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, password: "a".repeat(31) });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username must be at most 20 characters and password at most 30 characters"
    );
  });

  /**
   * Test case for creating a user with special characters in username
   */
  test("should return 400 if username contains special characters", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, username: "admin!" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username must not contain special characters"
    );
  });

  /**
   * Test case for creating a user with too short username
   */
  test("should return 400 if username is too short", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, username: "ad" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username must be at least 3 characters and password at least 4 characters"
    );
  });

  /**
   * Test case for creating a user with too short password
   */
  test("should return 400 if password is too short", async () => {
    const response = await request(app)
      .post(`/api/users`)
      .send({ ...exampleUser, password: "123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Username must be at least 3 characters and password at least 4 characters"
    );
  });
});
