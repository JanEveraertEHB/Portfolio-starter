const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const dotenvPath = path.resolve(__dirname, "../../../.env");

require("dotenv").config({ path: dotenvPath });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const usersRouter = require("./routes/users");
const threadsRouter = require("./routes/threads");
const repliesRouter = require("./routes/replies");

app.use("/api", usersRouter);
app.use("/api", threadsRouter);
app.use("/api", repliesRouter);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;
