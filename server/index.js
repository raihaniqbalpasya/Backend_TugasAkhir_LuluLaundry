const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
path.resolve();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
