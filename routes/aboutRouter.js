const express = require("express");
const router = express.Router();
const aboutController = require("../app/controllers/aboutController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", aboutController.getAll);
router.get("/:id", aboutController.getById);
router.post("/", adminMiddleware.authorize, aboutController.create);
router.put("/:id", adminMiddleware.authorize, aboutController.update);
router.delete("/:id", adminMiddleware.authorize, aboutController.deleteById);

module.exports = router;
