const express = require("express");
const router = express.Router();

// mendefinisikan file router
const mainRouter = require("./mainRouter");
const adminRouter = require("./adminRouter");
const jenisBarangRouter = require("./jenisBarangRouter");
const jenisLayananRouter = require("./jenisLayananRouter");
const alamatRouter = require("./alamatRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/jenisbarang", jenisBarangRouter);
router.use("/api/v1/jenislayanan", jenisLayananRouter);
router.use("/api/v1/alamat", alamatRouter);

module.exports = router;
