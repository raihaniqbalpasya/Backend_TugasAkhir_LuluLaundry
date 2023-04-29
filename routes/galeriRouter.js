const express = require("express");
const router = express.Router();
const galeriController = require("../app/controllers/galeriController");
const upload = require("../config/multer");

router.get("/", galeriController.getAll);
router.get("/:id", galeriController.getById);
router.post("/", upload.single("media"), galeriController.create);
router.put("/:id", upload.single("media"), galeriController.update);
router.delete("/:id", galeriController.deleteById);

module.exports = router;
