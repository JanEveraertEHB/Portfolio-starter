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
  jest.setTimeout(10000); // Increase timeout to 10 seconds
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
 * Clear the Replies and Threads tables before each test to avoid foreign key constraint violations.
 */
beforeEach(async () => {
  await db("Replies").del();
  await db("Threads").del();
});

/**
 * Integration tests for the /replies/:id endpoint (GET)
 */
describe("GET /replies/:id", () => {
  /**
   * Test case for retrieving a reply with a valid ID
   */
  test("should return a reply if found", async () => {
    const mockThread = {
      thread_id: 1,
      title: "Test Thread",
      content: "This is a test thread",
      user_id: 1,
      status: "active",
    };
    const mockReply = {
      reply_id: 1,
      content: "This is a reply to the first thread",
      thread_id: 1,
      user_id: 3,
      status: "active",
    };
    await db("Threads").insert(mockThread);
    await db("Replies").insert(mockReply);

    const response = await request(app).get(`/api/replies/1`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply_id", mockReply.reply_id);
    expect(response.body).toHaveProperty("content", mockReply.content);
    expect(response.body).toHaveProperty("thread_id", mockReply.thread_id);
    expect(response.body).toHaveProperty("user_id", mockReply.user_id);
    expect(response.body).toHaveProperty("status", mockReply.status);
  });

  /**
   * Test case for retrieving a reply with an invalid ID
   */
  test("should return 404 if reply not found", async () => {
    const response = await request(app).get(`/api/replies/999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Reply not found");
  });
});

/**
 * Integration tests for the /replies endpoint (POST)
 */
describe("POST /replies", () => {
  /**
   * Test case for creating a reply with content longer than 2000 characters
   */
  test("should not create a reply with content longer than 2000 characters", async () => {
    const newReply = {
      content: "a".repeat(2001),
      thread_id: 1,
      user_id: 1,
      status: "active",
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content cannot be longer than 2000 characters"
    );
  });

  /**
   * Test case for creating a reply with content shorter than 10 characters
   */
  test("should not create a reply with content shorter than 10 characters", async () => {
    const newReply = {
      content: "Short",
      thread_id: 1,
      user_id: 1,
      status: "active",
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content must be at least 10 characters long"
    );
  });

  /**
   * Test case for creating a reply with no content
   */
  test("should not create a reply with no content", async () => {
    const newReply = {
      thread_id: 1,
      user_id: 1,
      status: "active",
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with no thread_id
   */
  test("should not create a reply with no thread_id", async () => {
    const newReply = {
      content: "This is a new reply",
      user_id: 1,
      status: "active",
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with no user_id
   */
  test("should not create a reply with no user_id", async () => {
    const newReply = {
      content: "This is a new reply",
      thread_id: 1,
      status: "active",
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a reply with no status
   */
  test("should not create a reply with no status", async () => {
    const newReply = {
      content: "This is a new reply",
      thread_id: 1,
      user_id: 1,
    };

    const response = await request(app).post(`/api/replies`).send(newReply);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content, thread_id, user_id, and status are required"
    );
  });
});
