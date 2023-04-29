const express = require("express");
const router = express.Router();
const keuanganController = require("../app/controllers/keuanganController");
const upload = require("../config/multer");

router.get("/", keuanganController.getAll);
router.get("/:id", keuanganController.getById);
router.post("/", keuanganController.create);
router.put("/:id", keuanganController.update);
router.delete("/:id", keuanganController.deleteById);

module.exports = router;
