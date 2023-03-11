const express = require("express");
const router = express.Router();
const alamatController = require("../app/controllers/alamatController");

router.get("/", alamatController.getAll);
router.get("/:id", alamatController.getById);
router.post("/", alamatController.create);
router.put("/:id", alamatController.update);
router.delete("/:id", alamatController.deleteById);

module.exports = router;
