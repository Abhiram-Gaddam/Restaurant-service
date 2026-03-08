const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  modifyOrderItems
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createOrder);
router.get("/user", verifyToken, getUserOrders);
router.get("/admin", verifyToken, isAdmin, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/items", verifyToken, modifyOrderItems);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;