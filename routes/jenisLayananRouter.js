const express = require("express");
const router = express.Router();
const jenisLayananController = require("../app/controllers/jenisLayananController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", jenisLayananController.getAll);
router.get("/:id", jenisLayananController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  jenisLayananController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  jenisLayananController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  jenisLayananController.deleteById
);

module.exports = router;
