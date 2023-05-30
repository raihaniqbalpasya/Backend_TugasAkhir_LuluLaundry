const express = require("express");
const router = express.Router();
const barangController = require("../app/controllers/barangController");
const upload = require("../config/multer");

router.get("/", barangController.getAll);
router.get("/:id", barangController.getById);
router.post("/", upload.single("gambar"), barangController.create);
router.put("/:id", upload.single("gambar"), barangController.update);
router.delete("/:id", barangController.deleteById);

module.exports = router;
