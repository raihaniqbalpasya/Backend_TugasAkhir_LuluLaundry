const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const router = require("../routes");
const router = express.Router();

// mendefinisikan file router
const mainRouter = require("./mainRouter");
const adminRouter = require("./adminRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);

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
