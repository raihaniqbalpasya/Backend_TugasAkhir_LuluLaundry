const express = require("express");
const router = express.Router();
const infoUmumController = require("../app/controllers/infoUmumController");

router.get("/", infoUmumController.getAll);
router.get("/:id", infoUmumController.getById);
router.post("/", infoUmumController.create);
router.put("/:id", infoUmumController.update);
router.delete("/:id", infoUmumController.deleteById);

module.exports = router;
