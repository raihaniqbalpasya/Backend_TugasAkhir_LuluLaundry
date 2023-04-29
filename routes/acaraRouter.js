const express = require("express");
const router = express.Router();
const acaraController = require("../app/controllers/acaraController");
const upload = require("../config/multer");

router.get("/", acaraController.getAll);
router.get("/:id", acaraController.getById);
router.post("/", acaraController.create);
router.put("/:id", acaraController.update);
router.delete("/:id", acaraController.deleteById);

module.exports = router;
