const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

// admin modification
router.post("/login", adminController.login);
router.get("/", adminMiddleware.authorize, adminController.getAll);
router.get("/:id", adminMiddleware.authorize, adminController.getById);
router.post("/", adminMiddleware.authorize, adminController.create);
router.put("/:id", adminMiddleware.authorize, adminController.update);
router.delete("/:id", adminMiddleware.authorize, adminController.deleteById);

// user modification
router.get("/user/all", adminMiddleware.authorize, adminController.getAllUser);
router.post("/user", adminMiddleware.authorize, adminController.createUser);
router.put("/user/:id", adminMiddleware.authorize, adminController.updateUser);
router.put(
  "/user-address/:userId/:id",
  adminMiddleware.authorize,
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
