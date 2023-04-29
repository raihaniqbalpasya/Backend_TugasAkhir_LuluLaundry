const express = require("express");
const router = express.Router();
const acaraController = require("../app/controllers/acaraController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", acaraController.getAll);
router.get("/:id", acaraController.getById);
router.post(
  "/",
  adminMiddleware.authorize,
  upload.single("gambar"),
  acaraController.create
);
router.put(
  "/:id",
  adminMiddleware.authorize,
  upload.single("gambar"),
  acaraController.update
);
router.delete("/:id", adminMiddleware.authorize, acaraController.deleteById);

module.exports = router;
