const express = require("express");
const router = express.Router();
const caraPesanController = require("../app/controllers/caraPesanController");

router.get("/", caraPesanController.getAll);
router.get("/:id", caraPesanController.getById);
router.post("/", caraPesanController.create);
router.put("/:id", caraPesanController.update);
router.delete("/:id", caraPesanController.deleteById);

module.exports = router;
