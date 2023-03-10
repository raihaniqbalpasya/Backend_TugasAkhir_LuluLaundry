const express = require("express");
const router = express.Router();
const jenisLayananController = require("../app/controllers/jenisLayananController");

router.get("/", jenisLayananController.getAll);
router.get("/:id", jenisLayananController.getById);
router.post("/", jenisLayananController.create);
router.put("/:id", jenisLayananController.update);
router.delete("/:id", jenisLayananController.deleteById);

module.exports = router;
