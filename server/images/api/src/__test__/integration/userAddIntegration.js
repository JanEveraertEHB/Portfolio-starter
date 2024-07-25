/**
 * Integration tests for the POST /users endpoint
 */

const request = require("supertest");
const app = require("../../app.js"); // Adjust the path to your app instance
const knexConfig = require("../../db/knexfile"); // Adjust the path to your knex configuration
const db = require("knex")(knexConfig.development);

describe("POST /users", () => {
  /**
   * Runs before all tests in this block
   * - Migrates the latest database schema
   * - Runs the seed file to populate the database
   */
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  /**
   * Runs after all tests in this block
   * - Rolls back the database schema
   * - Destroys the database connection
   */
  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  /**
   * Test case for adding a new user
   * - Sends a POST request to /api/users with a new user object
   * - Expects a 201 status code
   * - Checks if the response body contains the inserted user information
   */
  test("should add a new user", async () => {
    const newUser = {
      user_id: 999, // Ensure this ID does not exist in the seed data
      username: "newuser",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty("user_id", newUser.user_id);
    expect(response.body).toHaveProperty("username", newUser.username);
    expect(response.body).toHaveProperty("password_hash"); // Ensure password is hashed
  });

  /**
   * Test case for adding a user with an existing ID
   * - Sends a POST request to /api/users with a user object that has an existing ID
   * - Expects a 400 status code
   * - Checks if the response body contains an error message
   */
  test("should not add a user with an existing ID", async () => {
    const existingUser = {
      user_id: 1, // This ID exists in the seed data
      username: "admin",
      password: "hashed_password1",
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
   * Test case for server error
   * - Simulates a server error by sending an invalid user object
   * - Expects a 500 status code
   * - Checks if the response body contains an error message
   */
  test("should return 500 for server error", async () => {
    const invalidUser = {
      user_id: 3,
      username: "invaliduser",
      // Missing password field to simulate server error
    };

    const response = await request(app)
      .post("/api/users")
      .send(invalidUser)
      .expect(500);

    expect(response.body).toHaveProperty("error");
  });
});
