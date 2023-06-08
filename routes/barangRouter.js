const express = require("express");
const router = express.Router();
const barangController = require("../app/controllers/barangController");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const upload = require("../config/multer");

router.get("/", barangController.getAll);
router.get("/:id", barangController.getById);
router.get(
  "/pemesananId/:pemesananId",
  adminMiddleware.authorize,
  barangController.getAllByPemesananId
);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  barangController.createByAdmin
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  barangController.updateByAdmin
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  barangController.deleteByAdmin
);

// crud barang by user
router.get(
  "/user/:pemesananId",
  userMiddleware.authorize,
  barangController.getAllByPemesananIdFromUser
);
router.post(
  "/user",
  userMiddleware.authorize,
  upload.single("gambar"),
  barangController.createByUser
);
router.put(
  "/user/:id",
  userMiddleware.authorize,
  upload.single("gambar"),
  barangController.updateByUser
);
router.delete(
  "/user/:id",
  userMiddleware.authorize,
  barangController.deleteByUser
);

module.exports = router;
