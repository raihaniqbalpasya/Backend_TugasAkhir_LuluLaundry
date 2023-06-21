const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

// admin authentication
router.post("/send-otp", adminController.sendOTP);
router.put("/verify-otp", adminController.verifyOTP);

// admin modification
router.post("/login", adminController.login);
router.get(
  "/",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.getAll
);
router.get(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.getById
);
router.get(
  "/statistic/data",
  adminMiddleware.authorize,
  adminController.getStatisticData
);
router.get(
  "/my/profile",
  adminMiddleware.authorize,
  adminController.getMyProfile
);
router.post(
  "/",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  upload.single("profilePic"),
  adminController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  upload.single("profilePic"),
  adminController.update
);
router.put(
  "/",
  adminMiddleware.authorize,
  upload.single("profilePic"),
  adminController.updateMyProfile
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.deleteById
);

// search function
router.get("/search/where", adminController.searchAdmin);

// password modification
router.put(
  "/change/password",
  adminMiddleware.authorize,
  adminController.changePassword
);
router.put("/forget/password", adminController.forgetPassword);

// delete profile picture
router.delete(
  "/delete/profilePic",
  adminMiddleware.authorize,
  adminController.deleteProfilePic
);

// user modification
router.get("/user/all", adminMiddleware.authorize, adminController.getAllUser);
router.get(
  "/user-address/:userId",
  adminMiddleware.authorize,
  adminController.getAllUserAddress
);
router.post(
  "/user",
  adminMiddleware.authorize,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "gambar", maxCount: 1 },
  ]),
  adminController.createUser
);
router.put(
  "/user/:id",
  adminMiddleware.authorize,
  upload.single("profilePic"),
  adminController.updateUser
);
router.put(
  "/user-address/:userId/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  adminController.updateUserAddress
);
router.delete(
  "/user/:id",
  adminMiddleware.authorize,
  adminController.deleteUser
);
router.delete(
  "/user-address/:userId/:id",
  adminMiddleware.authorize,
  adminController.deleteUserAddress
);

module.exports = router;
