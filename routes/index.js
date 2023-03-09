const express = require("express");
const router = express.Router();

// mendefinisikan file router
const mainRouter = require("./mainRouter");
const adminRouter = require("./adminRouter");
const jenisBarangRouter = require("./jenisBarangRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/jenisbarang", jenisBarangRouter);

module.exports = router;
