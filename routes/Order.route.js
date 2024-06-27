// routes
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updatePayment,
  myOrders,
  allReqorders,
  updateOrderStatus,
} = require("../controller/Order.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");

router.post("/orders", protect, createOrder);
router.get("/orders/:id", protect, getOrderById);
router.get("/allorders", protect, isAdmin, allReqorders);
router.get("/myorders", protect, myOrders);
router.put("/:id/pay", protect, updatePayment);
router.put("/orders/:orderId/status", protect, isAdmin, updateOrderStatus);
module.exports = router;
