const express = require("express");
const router = express.Router();
const reviewController = require("../app/controllers/reviewController");
const userMiddleware = require("../middleware/userMiddleware");
const upload = require("../config/multer");

router.get("/", reviewController.getAll);
router.get("/:id", reviewController.getById);
router.post(
  "/",
  userMiddleware.authorize,
  upload.single("gambar"),
  reviewController.create
);
router.put(
  "/:id",
  userMiddleware.authorize,
  upload.single("gambar"),
  reviewController.update
);
router.delete("/:id", userMiddleware.authorize, reviewController.deleteById);

module.exports = router;
