const express = require("express");
const router = express.Router();
const jenisLaundryController = require("../app/controllers/jenisLaundryController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", jenisLaundryController.getAll);
router.get("/:id", jenisLaundryController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  jenisLaundryController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  jenisLaundryController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  jenisLaundryController.deleteById
);

module.exports = router;
