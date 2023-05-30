const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

// admin modification
router.post("/login", adminController.login);
router.get("/", adminMiddleware.authorize, adminController.getAll);
router.get("/:id", adminMiddleware.authorize, adminController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.update
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  adminMiddleware.isMaster,
  adminController.deleteById
);

// search function
router.get("/search/where", adminController.searchAdmin);

// change password
router.put(
  "/change/password",
  adminMiddleware.authorize,
  adminController.changePassword
);

// user modification
router.get("/user/all", adminMiddleware.authorize, adminController.getAllUser);
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
  "/user-address/:userId",
  adminMiddleware.authorize,
  adminController.deleteUserAddress
);

module.exports = router;
