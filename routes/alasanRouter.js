const express = require("express");
const router = express.Router();
const alasanController = require("../app/controllers/alasanController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", alasanController.getAll);
router.get("/:id", alasanController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  alasanController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  alasanController.update
);
router.delete("/:id", adminMiddleware.authorize, alasanController.deleteById);

module.exports = router;
