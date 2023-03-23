const express = require("express");
const router = express.Router();
const galeriController = require("../app/controllers/galeriController");

router.get("/", galeriController.getAll);
router.get("/:id", galeriController.getById);
router.post("/", galeriController.create);
router.put("/:id", galeriController.update);
router.delete("/:id", galeriController.deleteById);

module.exports = router;
