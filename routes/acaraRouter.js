const express = require("express");
const router = express.Router();
const acaraController = require("../app/controllers/acaraController");

router.get("/", eventPromoController.getAll);
router.get("/:id", eventPromoController.getById);
router.post("/", eventPromoController.create);
router.put("/:id", eventPromoController.update);
router.delete("/:id", eventPromoController.deleteById);

module.exports = router;
