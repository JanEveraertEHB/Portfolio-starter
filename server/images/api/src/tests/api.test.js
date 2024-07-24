const request = require("supertest");
const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.status(200).json({ message: "pass!" });
});

test("GET /test", async () => {
  const response = await request(app).get("/test");
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("pass!");
});
