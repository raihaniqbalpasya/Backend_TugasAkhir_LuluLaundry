const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("../routes");

// database connection
const port = process.env.PORT || 3000;
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
