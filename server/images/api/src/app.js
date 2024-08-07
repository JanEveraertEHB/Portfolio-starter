const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const app = express();
const dotenvPath = path.resolve(__dirname, "../../../.env");

require("dotenv").config({ path: dotenvPath });

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const usersRouter = require("./routes/users");
app.use("/api", usersRouter);

app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "Users"');
    client.release();

    console.log("Fetched users:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error("Error during query:", err);
    res.send("Error " + err);
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;
