const express = require("express");
const router = express.Router();

// mendefinisikan file router
const mainRouter = require("./mainRouter");
const adminRouter = require("./adminRouter");
const jenisBarangRouter = require("./jenisBarangRouter");
const jenisLayananRouer = require("./jenisLayananRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/jenisbarang", jenisBarangRouter);
router.use("/api/v1/jenislayanan", jenisLayananRouer);

module.exports = router;
