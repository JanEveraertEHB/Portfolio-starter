const express = require("express");
const router = express.Router();
const knexConfig = require("../db/knexfile"); // Import the Knex configuration
const knex = require("knex")(knexConfig.development); // Initialize Knex with the development configuration
const bcrypt = require("bcryptjs");

// Create a new user
router.post("/users", async (req, res) => {
  const user = req.body;
  try {
    // Check if a user with the same ID already exists
    const existingUser = await knex("Users")
      .where({ user_id: user.user_id })
      .first();
    if (existingUser) {
      console.log("User with this ID already exists:", existingUser);
      return res
        .status(400)
        .json({ error: "User with this ID already exists" });
    }

    // Hash the password before inserting the user
    user.password_hash = await bcrypt.hash(user.password, 10);
    delete user.password; // Remove the plain password from the user object

    const [insertedUser] = await knex("Users").insert(user).returning("*");
    res.status(201).json(insertedUser);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve a specific user by ID
router.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const user = await knex("Users").where({ user_id: id }).first();
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
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

// Delete a specific user by ID
router.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const deleted = await knex("Users").where({ user_id: id }).del();
    if (deleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
});

// Validate user login
router.post("/users/login", async (req, res) => {
  const { username, password } = req.body; // Note: password, not password_hash
  try {
    const user = await knex("Users").where({ username }).first();
    if (user) {
      // Compare the provided password with the stored hashed password
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
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while validating login." });
  }
});

module.exports = router;
