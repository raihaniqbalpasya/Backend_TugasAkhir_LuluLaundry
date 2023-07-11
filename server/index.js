const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("../routes");
const http = require("http");

// database connection
const port = process.env.PORT || 4000;
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);
if (process.env.NODE_ENV !== "test") {
  server.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Example app listening on port ${port}`);
  });
}
module.exports = app;
