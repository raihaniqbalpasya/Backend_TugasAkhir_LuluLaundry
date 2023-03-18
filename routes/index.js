const express = require("express");
const router = express.Router();

// mendefinisikan file router
const mainRouter = require("./mainRouter");
const adminRouter = require("./adminRouter");
const jenisLaundryRouter = require("./jenisLaundryRouter");
const jenisLayananRouter = require("./jenisLayananRouter");
const alamatRouter = require("./alamatRouter");
const acaraRouter = require("./acaraRouter");
const keuanganRouter = require("./keuanganRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/jenislaundry", jenisLaundryRouter);
router.use("/api/v1/jenislayanan", jenisLayananRouter);
router.use("/api/v1/alamat", alamatRouter);
router.use("/api/v1/acara", acaraRouter);
router.use("/api/v1/keuangan", keuanganRouter);

module.exports = router;
