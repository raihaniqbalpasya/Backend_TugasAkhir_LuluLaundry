const express = require("express");
const router = express.Router();
const infoUmumController = require("../app/controllers/infoUmumController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", infoUmumController.getAll);
router.get("/:id", infoUmumController.getById);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("logo"),
  infoUmumController.update
);

module.exports = router;
