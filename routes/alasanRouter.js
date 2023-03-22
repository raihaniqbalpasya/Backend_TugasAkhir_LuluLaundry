const express = require("express");
const router = express.Router();
const alasanController = require("../app/controllers/alasanController");

router.get("/", alasanController.getAll);
router.get("/:id", alasanController.getById);
router.post("/", alasanController.create);
router.put("/:id", alasanController.update);
router.delete("/:id", alasanController.deleteById);

module.exports = router;
