const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");

router.get("/", adminController.getAll);
router.get("/:id", adminController.getById);
router.post("/", adminController.create);
router.put("/:id", adminController.update);
router.delete("/:id", adminController.deleteById);

module.exports = router;
