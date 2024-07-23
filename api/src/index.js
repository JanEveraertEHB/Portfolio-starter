const express = require("express");
const cors = require("cors");
const app = express();
const port = 1337;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    message: "hello test",
  });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
