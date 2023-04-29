const express = require("express");
const router = express.Router();
const alasanController = require("../app/controllers/alasanController");
const upload = require("../config/multer");

router.get("/", alasanController.getAll);
router.get("/:id", alasanController.getById);
router.post("/", upload.single("gambar"), alasanController.create);
router.put("/:id", upload.single("gambar"), alasanController.update);
router.delete("/:id", alasanController.deleteById);

module.exports = router;
