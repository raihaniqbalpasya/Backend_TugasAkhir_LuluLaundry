const express = require("express");
const router = express.Router();
const mPembayaranController = require("../app/controllers/mPembayaranController");
const upload = require("../config/multer");

router.get("/", mPembayaranController.getAll);
router.get("/:id", mPembayaranController.getById);
router.post("/", upload.single("logo"), mPembayaranController.create);
router.put("/:id", upload.single("logo"), mPembayaranController.update);
router.delete("/:id", mPembayaranController.deleteById);

module.exports = router;
