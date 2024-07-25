const request = require("supertest");
const app = require("../../app.js");
const knexConfig = require("../../db/knexfile");
const db = require("knex")(knexConfig.development);

/**
 * Integration tests for the /users/:id endpoint
 */
describe("GET /users/:id", () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  /**
   * Test case for retrieving user information with a valid user ID
   */
  test("should return user information for a valid user ID", async () => {
    const validUserId = 1;

    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty("user_id", validUserId);
    expect(response.body).toHaveProperty("username", "admin");
  });

  /**
   * Test case for retrieving additional user information with a valid user ID
   */
  test("should return additional user information for a valid user ID", async () => {
    const validUserId = 1;

    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty("user_id", validUserId);
    expect(response.body).toHaveProperty("username", "admin");
    expect(response.body).toHaveProperty("created_at");
  });

  /**
   * Test case for retrieving user information with a non-existent user ID
   */
  test("should return 404 for a non-existent user ID", async () => {
    const nonExistentUserId = 9999;

    const response = await request(app)
      .get(`/api/users/${nonExistentUserId}`)
      .expect(404);

    expect(response.body).toHaveProperty("error", "User not found");
  });

  /**
   * Test case for retrieving user information with an invalid user ID
   */
  test("should return 400 for an invalid user ID", async () => {
    const invalidUserId = "invalid";

    const response = await request(app)
      .get(`/api/users/${invalidUserId}`)
      .expect(400);

    expect(response.body).toHaveProperty("error", "Invalid user ID");
  });
});

/**
 * Integration tests for the /users endpoint
 */
describe("POST /users", () => {
  /**
   * Test case for adding a user with an existing ID
   */
  it("should not add a user with an existing ID", async () => {
    const existingUser = {
      user_id: 1,
      username: "admin",
      password: "password",
      role: "admin",
    };

    const response = await request(app)
      .post("/api/users")
      .send(existingUser)
      .expect(400);

    expect(response.body).toHaveProperty(
      "error",
      "User with this ID already exists"
    );
  });

  /**
   * Test case for handling server error when adding a user
   */
  it("should return 500 for server error", async () => {
    const invalidUser = {
      user_id: 5,
      username: "newuser",
      // Missing password field to simulate server error
    };

    const response = await request(app)
      .post("/api/users")
      .send(invalidUser)
      .expect(500);

    expect(response.body).toHaveProperty("error");
  });
});
