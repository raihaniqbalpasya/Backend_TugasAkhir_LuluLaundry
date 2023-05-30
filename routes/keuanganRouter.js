const express = require("express");
const router = express.Router();
const keuanganController = require("../app/controllers/keuanganController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", keuanganController.getAll);
router.get("/:id", keuanganController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  upload.single("gambar"),
  keuanganController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  upload.single("gambar"),
  keuanganController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  keuanganController.deleteById
);

// search function
router.get(
  "/search/where",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  keuanganController.searchFinance
);

module.exports = router;
