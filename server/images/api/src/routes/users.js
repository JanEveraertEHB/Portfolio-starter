const express = require("express");
const router = express.Router();
const knexConfig = require("../db/knexfile");
const knex = require("knex")(knexConfig.development);
const bcrypt = require("bcryptjs");

/**
 * User Parameters
 *
 * Represents the structure of a user object in the system.
 *
 * @typedef {object} User
 * @property {number} user_id - Unique identifier for the user.
 * @property {string} username - Name of the user.
 * @property {string} password - Password of the user.
 * @property {string} role - Role of the user (e.g., student, teacher).
 * @property {string} created_at - Timestamp of when the user record was created.
 * @property {string} updated_at - Timestamp of when the user record was last updated.
 */

// Function to initialize the database
async function initializeDatabase() {
  try {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}

// Initialize the database
initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

/**
 * POST /users
 *
 * This route creates a new user in the database.
 * It expects the user's username, password, and role in the request body.
 * If the user is successfully created, it returns the newly created user as JSON.
 * If there are validation errors or other issues, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {User} req.body - The HTTP request body contains the user.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the newly created user or an error message.
 */
router.post("/users", async (req, res) => {
  const { username, password, role } = req.body;

  // Validation checks
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required" });
  }

  if (username.length > 20 || password.length > 30) {
    return res.status(400).json({
      error:
        "Username must be at most 20 characters and password at most 30 characters",
    });
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res
      .status(400)
      .json({ error: "Username must not contain special characters" });
  }

  if (username.length < 3 || password.length < 4) {
    return res.status(400).json({
      error:
        "Username must be at least 3 characters and password at least 4 characters",
    });
  }

  try {
    // Check if the username already exists
    const existingUser = await knex("Users").where({ username }).first();

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const [insertedUser] = await knex("Users")
      .insert({
        UUID: knex.raw("public.uuid_generate_v4()"),
        username,
        password_hash,
        role,
      })
      .returning("*");

    res.status(201).json(insertedUser);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /users/:id
 *
 * This route retrieves a specific user's information from the database based on the provided ID.
 * It expects the user's ID as a parameter in the URL.
 * If the user is found, it returns the user's information as JSON.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the user to retrieve.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the user's information or an error message.
 */
router.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Validate the user ID
  if (isNaN(id) || id <= 0 || id > 99999999) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  knex("Users")
    .where({ user_id: id })
    .first()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user." });
    });
});

/**
 * GET /users
 *
 * This route retrieves all users from the database.
 * It returns an array of user objects as JSON.
 * If there is an error retrieving the users, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the array of users or an error message.
 */
router.get("/users", async (req, res) => {
  try {
    const users = await knex("Users").select("*");
    res.json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
});

/**
 * PUT /users/:id
 *
 * This route updates a specific user's information in the database based on the provided ID.
 * It expects the user's ID as a parameter in the URL and the updated user information in the request body.
 * If the user is successfully updated, it returns the updated user as JSON.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the user to update.
 * @param {User} req.body - The HTTP request body contains the updated user information.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either the updated user or an error message.
 */
router.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const userUpdates = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const [updatedUser] = await knex("Users")
      .where({ user_id: id })
      .update(userUpdates)
      .returning("*");

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
});

/**
 * DELETE /users/:id
 *
 * This route deletes a specific user from the database based on the provided ID.
 * It expects the user's ID as a parameter in the URL.
 * If the user is successfully deleted, it returns a success message.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.params - The HTTP request parameters.
 * @param {number} req.params.id - The ID of the user to delete.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either a success message or an error message.
 */
// Validate user ID
const isValidUserId = (id) => {
  return Number.isInteger(Number(id));
};

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  if (!isValidUserId(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Check if user exists
    const userExists = await knex("Users").where("user_id", userId).first();
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete related records in Replies table that reference threads created by the user
    await knex("Replies")
      .whereIn(
        "thread_id",
        knex("Threads").select("thread_id").where("user_id", userId)
      )
      .del();

    // Delete related records in Threads table
    await knex("Threads").where("user_id", userId).del();

    // Delete the user
    const result = await knex("Users").where("user_id", userId).del();

    if (result === 0) {
      console.error(`User not found: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(`Error deleting user: ${userId}`, err);
    if (err.code === "23503") {
      return res
        .status(409)
        .json({ error: "Cannot delete user with related records" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST /users/login
 *
 * This route validates a user's login credentials.
 * It expects the user's username and password in the request body.
 * If the credentials are valid, it returns a success message and the user's information.
 * If the credentials are invalid, it returns an appropriate error message.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The HTTP request body contains the login credentials.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {object} res - The HTTP response object.
 * @returns {object} JSON response with either a success message and user information or an error message.
 */
router.post("/users/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username && !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const user = await knex("Users").where({ username }).first();

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        res.json({ message: "Login successful", user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ error: "An error occurred while validating login." });
  }
});

module.exports = router;
