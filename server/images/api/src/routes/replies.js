const express = require("express");
const router = express.Router();
const knexConfig = require("../db/knexfile");
const knex = require("knex")(knexConfig.development);

/**
 * Reply Parameters
 * Represents the structure of a reply object in the system.
 *
 * @typedef {object} Reply
 * @property {number} reply_id - Unique identifier for the reply.
 * @property {string} content - Content of the reply.
 * @property {number} thread_id - ID of the thread the reply belongs to.
 * @property {number} user_id - ID of the user who created the reply.
 * @property {string} status - Status of the reply.
 * @property {string} created_at - Timestamp of when the reply was created.
 * @property {string} updated_at - Timestamp of when the reply was last updated.
 */

/**
 * POST /replies
 *
 * This route creates a new reply in the database.
 * It expects the reply's content, thread_id, user_id, and status in the request body.
 * If the reply is successfully created, it returns the newly created reply as JSON.
 * If there are validation errors or other issues, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {Reply} req.body - The HTTP request body contains the reply.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the newly created reply or an error message.
 */
router.post("/replies", async (req, res) => {
  const { content, thread_id, user_id, status } = req.body;

  const validationError = validateReply({
    content,
    thread_id,
    user_id,
    status,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [newReply] = await knex("Replies")
      .insert({ content, thread_id, user_id, status })
      .returning(["reply_id", "content", "thread_id", "user_id", "status"]);
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reply" });
  }
});

/**
 * Validate reply data
 * @param {object} reply - The reply object to validate.
 * @param {string} reply.content - The content of the reply.
 * @param {number} reply.thread_id - The ID of the thread the reply belongs to.
 * @param {number} reply.user_id - The ID of the user who created the reply.
 * @param {string} reply.status - The status of the reply.
 * @returns {string|null} Validation error message or null if valid.
 */
function validateReply({ content, thread_id, user_id, status }) {
  if (!content || !thread_id || !user_id || !status) {
    return "Content, thread_id, user_id, and status are required";
  }
  if (content.length > 2000) {
    return "Content cannot be longer than 2000 characters";
  }
  if (content.length < 10) {
    return "Content must be at least 10 characters long";
  }
  return null;
}

/**
 * GET /replies/:id
 *
 * This route retrieves a specific reply's information from the database based on the provided ID.
 * It expects the reply's ID as a parameter in the URL.
 * If the reply is found, it returns the reply's information as JSON.
 * If the reply is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the reply to retrieve.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the reply's information or an error message.
 */
router.get("/replies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reply = await knex("Replies").where({ reply_id: id }).first();
    if (reply) {
      res.status(200).json(reply);
    } else {
      res.status(404).json({ error: "Reply not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reply" });
  }
});

/**
 * GET /replies
 *
 * This route retrieves all replies from the database.
 * It returns an array of reply objects as JSON.
 * If there is an error retrieving the replies, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the array of replies or an error message.
 */
router.get("/replies", async (req, res) => {
  try {
    const replies = await knex("Replies").select("*");
    res.status(200).json(replies);
  } catch (error) {
    console.error("Error retrieving replies:", error);
    res.status(500).json({ error: "Failed to retrieve replies" });
  }
});

/**
 * GET /replies/thread/:threadId
 *
 * This route retrieves all replies for a specific thread from the database based on the provided thread ID.
 * It expects the thread's ID as a parameter in the URL.
 * If the replies are found, it returns an array of reply objects as JSON.
 * If there is an error retrieving the replies, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.threadId - The ID of the thread to retrieve replies for.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the array of replies or an error message.
 */
router.get("/replies/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const replies = await knex("Replies").where({ thread_id: threadId });
    res.status(200).json(replies);
  } catch (error) {
    console.error("Error retrieving replies for thread:", error);
    res.status(500).json({ error: "Failed to retrieve replies for thread" });
  }
});

/**
 * PUT /replies/:id
 *
 * This route updates a specific reply's information in the database based on the provided ID.
 * It expects the reply's ID as a parameter in the URL and the updated reply information in the request body.
 * If the reply is successfully updated, it returns the updated reply as JSON.
 * If the reply is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the reply to update.
 * @param {Reply} req.body - The HTTP request body contains the updated reply information.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the updated reply or an error message.
 */
router.put("/replies/:id", async (req, res) => {
  const { id } = req.params;
  const { content, status } = req.body;

  // Validate required fields
  if (!status) {
    return res.status(400).json({
      error: "Status is required",
    });
  }

  try {
    const reply = await knex("Replies").where({ reply_id: id }).first();
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    await knex("Replies")
      .where({ reply_id: id })
      .update({ content, status, updated_at: new Date() });

    const updatedReply = await knex("Replies").where({ reply_id: id }).first();
    console.log("Updated Reply:", updatedReply);
    res.status(200).json(updatedReply);
  } catch (error) {
    console.error("Error updating reply:", error);
    res.status(500).json({ error: "Failed to update reply" });
  }
});

/**
 * DELETE /replies/:id
 *
 * This route deletes a specific reply from the database based on the provided ID.
 * It expects the reply's ID as a parameter in the URL.
 * If the reply is successfully deleted, it returns a success message.
 * If the reply is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the reply to delete.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either a success message or an error message.
 */
router.delete("/replies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await knex("Replies").where({ reply_id: id }).del();
    if (deletedRows) {
      console.log("Deleted Reply ID:", id);
      res.status(200).json({ message: "Reply deleted successfully" });
    } else {
      res.status(404).json({ error: "Reply not found" });
    }
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ error: "Failed to delete reply" });
  }
});

module.exports = router;
