const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const userMiddleware = require("../middleware/userMiddleware");

// user modification
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userMiddleware.authorize, userController.getMyProfile);
router.put("/", userMiddleware.authorize, userController.updateProfile);
router.delete("/", userMiddleware.authorize, userController.deleteProfile);

// change password
router.put(
  "/change-password",
  userMiddleware.authorize,
  userController.changePassword
);

// address user modification
router.get("/address", userMiddleware.authorize, userController.getAllAddress);
router.get(
  "/address/:id",
  userMiddleware.authorize,
  userController.getAddressById
);
router.post("/address", userMiddleware.authorize, userController.createAddress);
router.put(
  "/address/:id",
  userMiddleware.authorize,
  userController.updateAddress
);
router.delete(
  "/address/:id",
  userMiddleware.authorize,
  userController.deleteAddress
);
router.delete(
  "/address",
  userMiddleware.authorize,
  userController.deleteAllAddress
);

module.exports = router;
