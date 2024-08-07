const express = require("express");
const router = express.Router();
const knexConfig = require("../db/knexfile");
const knex = require("knex")(knexConfig.development);
const bcrypt = require("bcryptjs");

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
    const password_hash = await bcrypt.hash(password, 10);
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

// Retrieve a specific user by ID
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

// Update a specific user by ID
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

// Validate user login
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
