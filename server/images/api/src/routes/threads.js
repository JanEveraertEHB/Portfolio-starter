const express = require("express");
const router = express.Router();
const knexConfig = require("../db/knexfile");
const knex = require("knex")(knexConfig.development);

/**
 * Thread Parameters
 * Represents the structure of a thread object in the system.
 *
 * @typedef {object} Thread
 * @property {number} thread_id - Unique identifier for the thread.
 * @property {string} title - Title of the thread.
 * @property {string} content - Content of the thread.
 * @property {number} user_id - ID of the user who created the thread.
 * @property {string} status - Status of the thread.
 * @property {string} created_at - Timestamp of when the thread was created.
 * @property {string} updated_at - Timestamp of when the thread was last updated.
 */

/**
 * POST /threads
 *
 * This route creates a new thread in the database.
 * It expects the thread's title, content, user_id, and status in the request body.
 * If the thread is successfully created, it returns the newly created thread as JSON.
 * If there are validation errors or other issues, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {Thread} req.body - The HTTP request body contains the thread.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the newly created thread or an error message.
 */
router.post("/threads", async (req, res) => {
  const { title, content, user_id, status } = req.body;

  // Validate thread data
  const validationError = validateThread({ title, content, user_id, status });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // Insert new thread into the database
    const [newThread] = await knex("Threads")
      .insert({ title, content, user_id, status })
      .returning(["thread_id", "title", "content", "user_id", "status"]);

    // Respond with the created thread
    res.status(201).json(newThread);
  } catch (error) {
    console.error("Failed to create thread:", error); // Log server-side error
    res.status(500).json({ error: "Failed to create thread" });
  }
});

/**
 * Validate thread data
 * @param {object} thread - The thread object to validate.
 * @param {string} thread.title - The title of the thread.
 * @param {string} thread.content - The content of the thread.
 * @param {number} thread.user_id - The ID of the user who created the thread.
 * @param {string} thread.status - The status of the thread.
 * @returns {string|null} Validation error message or null if valid.
 */
function validateThread({ title, content, user_id, status }) {
  if (!title || !content || !user_id || !status) {
    return "Title, content, user_id, and status are required.";
  }
  if (title.length > 100) {
    return "Title cannot be longer than 100 characters.";
  }
  if (title.length < 10) {
    return "Title must be at least 10 characters long.";
  }
  if (content.length > 2000) {
    return "Content cannot be longer than 2000 characters.";
  }
  if (content.length < 20) {
    return "Content must be at least 20 characters long.";
  }
  return null;
}

/**
 * GET /threads/:id
 *
 * This route retrieves a specific thread's information from the database based on the provided ID.
 * It expects the thread's ID as a parameter in the URL.
 * If the thread is found, it returns the thread's information as JSON.
 * If the thread is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the thread to retrieve.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the thread's information or an error message.
 */
router.get("/threads/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await knex("Threads").where({ thread_id: id }).first();
    if (thread) {
      res.status(200).json(thread);
    } else {
      res.status(404).json({ error: "Thread not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve thread" });
  }
});

/**
 * GET /threads
 *
 * This route retrieves all threads from the database.
 * It returns an array of thread objects as JSON.
 * If there is an error retrieving the threads, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the array of threads or an error message.
 */
router.get("/threads", async (req, res) => {
  try {
    const threads = await knex("Threads").select("*");
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error retrieving threads:", error);
    res.status(500).json({ error: "Failed to retrieve threads" });
  }
});

/**
 * PUT /threads/:id
 * This route updates a specific thread's information in the database based on the provided ID.
 * It expects the thread's ID as a parameter in the URL and the updated thread information in the request body.
 * If the thread is successfully updated, it returns the updated thread as JSON.
 * If the thread is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the thread to update.
 * @param {Thread} req.body - The HTTP request body contains the updated thread information.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the updated thread or an error message.
 */
router.put("/threads/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  // Validate required fields
  if (!title || !content || !status) {
    return res.status(400).json({
      error: "Title, content, and status are required",
    });
  }

  try {
    const thread = await knex("Threads").where({ thread_id: id }).first();
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    await knex("Threads")
      .where({ thread_id: id })
      .update({ title, content, status, updated_at: new Date() });

    const updatedThread = await knex("Threads")
      .where({ thread_id: id })
      .first();
    console.log("Updated Thread:", updatedThread);
    res.status(200).json(updatedThread);
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ error: "Failed to update thread" });
  }
});

/**
 * DELETE /threads/:id
 *
 * This route deletes a specific thread from the database based on the provided ID.
 * It expects the thread's ID as a parameter in the URL.
 * If the thread is successfully deleted, it returns a success message.
 * If the thread is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the thread to delete.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either a success message or an error message.
 */
router.delete("/threads/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await knex("Threads").where({ thread_id: id }).del();
    if (deletedRows) {
      console.log("Deleted Thread ID:", id);
      res.status(200).json({ message: "Thread deleted successfully" });
    } else {
      res.status(404).json({ error: "Thread not found" });
    }
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

module.exports = router;
