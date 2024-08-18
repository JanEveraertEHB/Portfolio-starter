const request = require("supertest");
const app = require("../../app.js");
const knexConfig = require("../../db/knexfile.js");
const db = require("knex")(knexConfig.development);
const seed = require("../../db/seeds/initial_seed.js"); // Updated to correct relative path

/**
 * Setup test data before running the tests.
 * This includes seeding the database and starting a transaction.
 */
beforeAll(async () => {
  await seed.seed(db);
  await db.raw("BEGIN");
});

/**
 * Cleanup test data after running the tests.
 * This includes rolling back the transaction and destroying the database connection.
 */
afterAll(async () => {
  await db.raw("ROLLBACK");
  await db.destroy();
});

/**
 * Integration tests for the /users/:id endpoint (GET)
 */
describe("GET /users/:id", () => {
  /**
   * Test case for retrieving user information with a valid user ID
   */
  test("should return user information for a valid user ID", async () => {
    const validUserId = 1; // Ensure this matches the seeded user ID

    const response = await request(app).get(`/api/users/${validUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user_id", validUserId);
  });

  /**
   * Test case for retrieving user information with an invalid user ID
   */
  test("should return 404 for non-existent user ID", async () => {
    const nonExistentUserId = 99999;
    const response = await request(app).get(`/api/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);

    const dbRecord = await db("Users")
      .select("*")
      .where("user_id", nonExistentUserId);
    expect(dbRecord.length).toBe(0);
  });

  /**
   * Test case for retrieving user information with a negative user ID
   */
  test("should return 400 for negative user ID", async () => {
    const negativeUserId = -12;
    const response = await request(app).get(`/api/users/${negativeUserId}`);
    expect(response.status).toBe(400);
  });

  /**
   * Test case for retrieving user information with a non-numeric user ID
   */
  test("should return 400 for non-numeric user ID", async () => {
    const nonNumericUserId = "hello";
    const response = await request(app).get(`/api/users/${nonNumericUserId}`);
    expect(response.status).toBe(400);
  });

  /**
   * Test case for retrieving user information with a too large user ID
   */
  test("should return 400 for too large user ID", async () => {
    const tooLargeUserId = 999999999;
    const response = await request(app).get(`/api/users/${tooLargeUserId}`);
    expect(response.status).toBe(400);
  });
});

/**
 * Integration tests for the /users/:id endpoint (PUT)
 */
describe("PUT /users/:id", () => {
  /**
   * Test case for updating user information with a valid user ID
   */
  test("should update user information for a valid user ID", async () => {
    const validUserId = 1; // Ensure this matches the seeded user ID
    const userUpdates = { username: "Updated Name" };

    const response = await request(app)
      .put(`/api/users/${validUserId}`)
      .send(userUpdates);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "Updated Name");
  });

  /**
   * Test case for updating user information with a negative user ID
   */
  test("should return 404 for negative user ID", async () => {
    const negativeUserId = -12;
    const userUpdates = { username: "Updated Name" };

    const response = await request(app)
      .put(`/api/users/${negativeUserId}`)
      .send(userUpdates);

    expect(response.status).toBe(404);
  });

  /**
   * Test case for updating user information with a too large user ID
   */
  test("should return 404 for too large user ID", async () => {
    const tooLargeUserId = 999999999;
    const userUpdates = { username: "Updated Name" };

    const response = await request(app)
      .put(`/api/users/${tooLargeUserId}`)
      .send(userUpdates);

    expect(response.status).toBe(404);
  });
});

/**
 * Integration tests for the /users/:id endpoint (DELETE)
 */
describe("DELETE /users/:id", () => {
  /**
   * Test case for deleting a user with a valid user ID
   */
  test("should delete a user with a valid ID", async () => {
    const validUserId = 1; // Ensure this matches the seeded user ID

    const response = await request(app).delete(`/api/users/${validUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );

    const dbRecord = await db("Users")
      .select("*")
      .where("user_id", validUserId);
    expect(dbRecord.length).toBe(0);
  });

  /**
   * Test case for deleting a user with an invalid user ID
   */
  test("should return 400 for an invalid user ID", async () => {
    const invalidUserId = "invalid";

    const response = await request(app).delete(`/api/users/${invalidUserId}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid user ID");
  });

  /**
   * Test case for deleting a non-existent user
   */
  test("should return 404 for a non-existent user ID", async () => {
    const nonExistentUserId = 99999;

    const response = await request(app).delete(
      `/api/users/${nonExistentUserId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });
});
