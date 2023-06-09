const express = require("express");
const router = express.Router();
const faqController = require("../app/controllers/faqController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", faqController.getAll);
router.get("/:id", faqController.getById);
router.post("/", adminMiddleware.authorize, faqController.create);
router.put("/:id", adminMiddleware.authorize, faqController.update);
router.delete("/:id", adminMiddleware.authorize, faqController.deleteById);

module.exports = router;
