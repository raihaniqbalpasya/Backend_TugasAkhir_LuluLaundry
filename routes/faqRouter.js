const express = require("express");
const router = express.Router();
const faqController = require("../app/controllers/faqController");

router.get("/", faqController.getAll);
router.get("/:id", faqController.getById);
router.post("/", faqController.create);
router.put("/:id", faqController.update);
router.delete("/:id", faqController.deleteById);

module.exports = router;
