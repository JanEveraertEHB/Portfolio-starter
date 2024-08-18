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
 * Integration tests for the /replies endpoint (POST)
 */
describe("POST /replies", () => {
  const newReply = {
    content: "This is a test reply.",
    thread_id: 1,
    user_id: 1,
    status: "active",
  };

  /**
   * Test case for creating a reply with valid data
   */
  test("should create a new reply", async () => {
    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("reply_id");
    expect(response.body).toHaveProperty("content", newReply.content);
    expect(response.body).toHaveProperty("thread_id", newReply.thread_id);
    expect(response.body).toHaveProperty("user_id", newReply.user_id);
    expect(response.body).toHaveProperty("status", newReply.status);
  });

  /**
   * Test case for creating a reply with missing content
   */
  test("should return 400 if content is missing", async () => {
    const response = await request(app)
      .post(`/api/replies`)
      .send({ ...newReply, content: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with missing thread_id
   */
  test("should return 400 if thread_id is missing", async () => {
    const response = await request(app)
      .post(`/api/replies`)
      .send({ ...newReply, thread_id: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with missing user_id
   */
  test("should return 400 if user_id is missing", async () => {
    const response = await request(app)
      .post(`/api/replies`)
      .send({ ...newReply, user_id: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with missing status
   */
  test("should return 400 if status is missing", async () => {
    const response = await request(app)
      .post(`/api/replies`)
      .send({ ...newReply, status: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });
});
