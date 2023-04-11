const express = require("express");
const router = express.Router();
const alamatController = require("../app/controllers/alamatController");

router.get("/", alamatController.getAll);
router.get("/:id", alamatController.getById);

module.exports = router;
