const express = require("express");
const router = express.Router();
const jenisBarangController = require("../app/controllers/jenisBarangController");

router.get("/", jenisBarangController.getAll);
router.get("/:id", jenisBarangController.getById);
router.post("/", jenisBarangController.create);
router.put("/:id", jenisBarangController.update);
router.delete("/:id", jenisBarangController.deleteById);

module.exports = router;
