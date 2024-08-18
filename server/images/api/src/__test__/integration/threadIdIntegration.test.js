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
 * Clear the Replies and Threads tables before each test to avoid foreign key constraint violations.
 */
beforeEach(async () => {
  await db("Replies").del();
  await db("Threads").del();
});

/**
 * Integration tests for the /threads/:id endpoint (GET)
 */
describe("GET /threads/:id", () => {
  /**
   * Test case for retrieving a thread with a valid ID
   */
  test("should return a thread if found", async () => {
    const mockThread = {
      thread_id: 1,
      title: "First Thread",
      content: "This is the first thread",
      user_id: 1,
      status: "open",
    };
    await db("Threads").insert(mockThread);

    const response = await request(app).get(`/api/threads/1`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("thread_id", mockThread.thread_id);
    expect(response.body).toHaveProperty("title", mockThread.title);
    expect(response.body).toHaveProperty("content", mockThread.content);
    expect(response.body).toHaveProperty("user_id", mockThread.user_id);
    expect(response.body).toHaveProperty("status", mockThread.status);
  });

  /**
   * Test case for retrieving a thread with an invalid ID
   */
  test("should return 404 if thread not found", async () => {
    const response = await request(app).get(`/api/threads/999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Thread not found");
  });
});

/**
 * Integration tests for the /threads endpoint (POST)
 */
describe("POST /threads", () => {
  /**
   * Test case for creating a new thread
   */
  test("should create a new thread", async () => {
    const newThread = {
      title: "New Thread",
      content: "This is a new thread",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("thread_id");
    expect(response.body).toHaveProperty("title", newThread.title);
    expect(response.body).toHaveProperty("content", newThread.content);
    expect(response.body).toHaveProperty("user_id", newThread.user_id);
    expect(response.body).toHaveProperty("status", newThread.status);
  });

  /**
   * Test case for creating a thread with a title longer than 100 characters
   */
  test("should not create a thread with a title longer than 100 characters", async () => {
    const newThread = {
      title: "a".repeat(101),
      content: "This is a new thread",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title cannot be longer than 100 characters"
    );
  });

  /**
   * Test case for creating a thread with content longer than 2000 characters
   */
  test("should not create a thread with content longer than 2000 characters", async () => {
    const newThread = {
      title: "New Thread",
      content: "a".repeat(2001),
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content cannot be longer than 2000 characters"
    );
  });

  /**
   * Test case for creating a thread with a title shorter than 10 characters
   */
  test("should not create a thread with a title shorter than 10 characters", async () => {
    const newThread = {
      title: "Short",
      content: "This is a new thread",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title must be at least 10 characters long"
    );
  });

  /**
   * Test case for creating a thread with content shorter than 30 characters
   */
  test("should not create a thread with content shorter than 20 characters", async () => {
    const newThread = {
      title: "New Thread",
      content: "Short content",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Content must be at least 20 characters long"
    );
  });

  /**
   * Test case for creating a thread with no title
   */
  test("should not create a thread with no title", async () => {
    const newThread = {
      content: "This is a new thread",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });

  /**
   * Test case for creating a thread with no content
   */
  test("should not create a thread with no content", async () => {
    const newThread = {
      title: "New Thread",
      user_id: 1,
      status: "open",
    };

    const response = await request(app).post(`/api/threads`).send(newThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title, content, user_id, and status are required"
    );
  });
});
