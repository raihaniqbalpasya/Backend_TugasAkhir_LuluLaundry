const express = require("express");
const router = express.Router();
const mPembayaranController = require("../app/controllers/mPembayaranController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", mPembayaranController.getAll);
router.get("/:id", mPembayaranController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("logo"),
  mPembayaranController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("logo"),
  mPembayaranController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  mPembayaranController.deleteById
);

module.exports = router;
