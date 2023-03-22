const express = require("express");
const router = express.Router();
const aboutController = require("../app/controllers/aboutController");

router.get("/", aboutController.getAll);
router.get("/:id", aboutController.getById);
router.post("/", aboutController.create);
router.put("/:id", aboutController.update);
router.delete("/:id", aboutController.deleteById);

module.exports = router;
