const express = require("express");
const router = express.Router();
const acaraController = require("../app/controllers/acaraController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", acaraController.getAll);
router.get("/:id", acaraController.getById);
router.get("/search/active", acaraController.searchEventAktif);
router.get("/search/coming-soon", acaraController.searchEventMendatang);
router.get("/search/done", acaraController.searchEventSelesai);
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

// update status
router.put(
  "/update-status/:id",
  adminMiddleware.authorize,
  acaraController.updateStatusEvent
);

module.exports = router;
