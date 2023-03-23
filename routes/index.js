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
const mPembayaranRouter = require("./mPembayaranRouter");
const aboutRouter = require("./aboutRouter");
const alasanRouter = require("./alasanRouter");
const galeriRouter = require("./galeriRouter");

// route endpoint api
router.use("/", mainRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/jenislaundry", jenisLaundryRouter);
router.use("/api/v1/jenislayanan", jenisLayananRouter);
router.use("/api/v1/alamat", alamatRouter);
router.use("/api/v1/acara", acaraRouter);
router.use("/api/v1/keuangan", keuanganRouter);
router.use("/api/v1/metodepembayaran", mPembayaranRouter);
router.use("/api/v1/about", aboutRouter);
router.use("/api/v1/alasan", alasanRouter);
router.use("/api/v1/galeri", galeriRouter);

module.exports = router;
