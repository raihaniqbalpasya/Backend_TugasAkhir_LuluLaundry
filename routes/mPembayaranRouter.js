const express = require("express");
const router = express.Router();
const mPembayaranController = require("../app/controllers/mPembayaranController");

router.get("/", mPembayaranController.getAll);
router.get("/:id", mPembayaranController.getById);
router.post("/", mPembayaranController.create);
router.put("/:id", mPembayaranController.update);
router.delete("/:id", mPembayaranController.deleteById);

module.exports = router;
