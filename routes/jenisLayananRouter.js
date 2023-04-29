const express = require("express");
const router = express.Router();
const jenisLayananController = require("../app/controllers/jenisLayananController");
const upload = require("../config/multer");

router.get("/", jenisLayananController.getAll);
router.get("/:id", jenisLayananController.getById);
router.post("/", upload.single("gambar"), jenisLayananController.create);
router.put("/:id", upload.single("gambar"), jenisLayananController.update);
router.delete("/:id", jenisLayananController.deleteById);

module.exports = router;
