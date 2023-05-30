const express = require("express");
const router = express.Router();
const notifController = require("../app/controllers/notifController");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", notifController.getAll);
router.get("/:id", notifController.getById);
router.get(
  "/user/:userId",
  userMiddleware.authorize,
  notifController.getAllByUser
);
router.put(
  "/all/user/:userId",
  userMiddleware.authorize,
  notifController.readAllByUser
);
router.put(
  "/user/:id",
  userMiddleware.authorize,
  notifController.updateStatusByUser
);
router.put(
  "/all/admin",
  adminMiddleware.authorize,
  notifController.readAllByAdmin
);
router.put(
  "/admin/:id",
  adminMiddleware.authorize,
  notifController.updateStatusByAdmin
);
router.delete("/:id", notifController.deleteById);

module.exports = router;
