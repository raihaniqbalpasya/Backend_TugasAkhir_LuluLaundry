const express = require("express");
const router = express.Router();
const galeriController = require("../app/controllers/galeriController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", galeriController.getAll);
router.get("/:id", galeriController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("media"),
  galeriController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("media"),
  galeriController.update
);
router.delete("/:id", adminMiddleware.authorize, galeriController.deleteById);

module.exports = router;
