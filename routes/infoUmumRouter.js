const express = require("express");
const router = express.Router();
const infoUmumController = require("../app/controllers/infoUmumController");
const upload = require("../config/multer");

router.get("/", infoUmumController.getAll);
router.get("/:id", infoUmumController.getById);
router.put("/:id", upload.single("logo"), infoUmumController.update);

module.exports = router;
