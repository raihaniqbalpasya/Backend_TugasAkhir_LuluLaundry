const express = require("express");
const router = express.Router();
const pemesananController = require("../app/controllers/pemesananController");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

router.get("/", pemesananController.getAll);
router.get("/:id", pemesananController.getById);
router.post(
  "/user",
  userMiddleware.authorize,
  pemesananController.createByUser
);
router.post(
  "/admin",
  adminMiddleware.authorize,
  pemesananController.createByAdmin
);
router.put(
  "/user/:id",
  userMiddleware.authorize,
  pemesananController.updateByUser
);
router.put(
  "/admin/:id",
  adminMiddleware.authorize,
  pemesananController.updateByAdmin
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  pemesananController.deleteById
);

module.exports = router;
