const express = require("express");
const router = express.Router();
const jenisLaundryController = require("../app/controllers/jenisLaundryController");
const upload = require("../config/multer");

router.get("/", jenisLaundryController.getAll);
router.get("/:id", jenisLaundryController.getById);
router.post("/", upload.single("gambar"), jenisLaundryController.create);
router.put("/:id", upload.single("gambar"), jenisLaundryController.update);
router.delete("/:id", jenisLaundryController.deleteById);

module.exports = router;
