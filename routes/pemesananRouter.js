const express = require("express");
const router = express.Router();
const pemesananController = require("../app/controllers/pemesananController");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

router.get("/", pemesananController.getAll);
router.get("/:id", pemesananController.getById);
router.get("/where/status", pemesananController.getAllByStatus);
router.get("/nomor/:nomorPesanan", pemesananController.getByNomorPesanan);
router.get(
  "/user/all",
  userMiddleware.authorize,
  pemesananController.getAllByUserId
);
router.post(
  "/user",
  userMiddleware.authorize,
  pemesananController.createByUser
);
router.put(
  "/user/:id",
  userMiddleware.authorize,
  pemesananController.updateByUser
);
router.post(
  "/admin",
  adminMiddleware.authorize,
  pemesananController.createByAdmin
);
router.put(
  "/admin/:id",
  adminMiddleware.authorize,
  pemesananController.updateByAdmin
);
router.put(
  "/admin/status/:id",
  adminMiddleware.authorize,
  pemesananController.updateOrderStatus
);
router.put(
  "/admin/payment-status/:id",
  adminMiddleware.authorize,
  pemesananController.updatePaymentStatus
);
router.delete(
  "/:id",
  adminMiddleware.authorize,
  pemesananController.deleteById
);

// search function
router.get(
  "/search/where",
  adminMiddleware.authorize,
  pemesananController.searchOrder
);

module.exports = router;
