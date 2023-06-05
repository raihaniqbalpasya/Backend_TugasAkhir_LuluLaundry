const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const userMiddleware = require("../middleware/userMiddleware");
const upload = require("../config/multer");

// user modification
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userMiddleware.authorize, userController.getMyProfile);
router.put(
  "/:id",
  userMiddleware.authorize,
  upload.single("profilePic"),
  userController.updateProfile
);
router.delete("/", userMiddleware.authorize, userController.deleteProfile);

// search function
router.get("/search", userController.searchUser);

// delete profile picture
router.delete(
  "/profilePic",
  userMiddleware.authorize,
  userController.deleteProfilePic
);

// change password
router.put(
  "/change/password",
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
router.post(
  "/address",
  userMiddleware.authorize,
  upload.single("gambar"),
  userController.createAddress
);
router.put(
  "/address/:id",
  userMiddleware.authorize,
  upload.single("gambar"),
  userController.updateAddress
);
router.put(
  "/address/status/:id",
  userMiddleware.authorize,
  userController.updateAddressStatus
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
