const express = require("express");
const router = express.Router();
const caraPesanController = require("../app/controllers/caraPesanController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", caraPesanController.getAll);
router.get("/:id", caraPesanController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  caraPesanController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  caraPesanController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  caraPesanController.deleteById
);

module.exports = router;
