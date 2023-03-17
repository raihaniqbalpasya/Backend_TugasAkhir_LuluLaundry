const express = require("express");
const router = express.Router();
const jenisLaundryController = require("../app/controllers/jenisLaundryController");

router.get("/", jenisLaundryController.getAll);
router.get("/:id", jenisLaundryController.getById);
router.post("/", jenisLaundryController.create);
router.put("/:id", jenisLaundryController.update);
router.delete("/:id", jenisLaundryController.deleteById);

module.exports = router;
