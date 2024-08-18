const request = require("supertest");
const app = require("../../app.js");
const knexConfig = require("../../db/knexfile.js");
const db = require("knex")(knexConfig.development);
const seed = require("../../db/seeds/initial_seed.js");

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
 * Integration tests for the /threads endpoint (POST)
 */
describe("POST /threads", () => {
  const newThread = {
    title: "Test Thread",
    content: "This is a test thread.",
    user_id: 1,
    status: "active",
  };

  /**
   * Test case for creating a thread with valid data
   */
  test("should create a new thread", async () => {
    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("thread_id");
    expect(response.body).toHaveProperty("title", newThread.title);
    expect(response.body).toHaveProperty("content", newThread.content);
    expect(response.body).toHaveProperty("user_id", newThread.user_id);
    expect(response.body).toHaveProperty("status", newThread.status);
  });

  /**
   * Test case for creating a thread with missing title
   */
  test("should return 400 if title is missing", async () => {
    const response = await request(app)
      .post(`/api/threads`)
      .send({ ...newThread, title: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a thread with missing content
   */
  test("should return 400 if content is missing", async () => {
    const response = await request(app)
      .post(`/api/threads`)
      .send({ ...newThread, content: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a thread with missing user_id
   */
  test("should return 400 if user_id is missing", async () => {
    const response = await request(app)
      .post(`/api/threads`)
      .send({ ...newThread, user_id: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a thread with missing status
   */
  test("should return 400 if status is missing", async () => {
    const response = await request(app)
      .post(`/api/threads`)
      .send({ ...newThread, status: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });
});
