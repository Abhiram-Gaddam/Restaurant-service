const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// USER
router.post("/", verifyToken, createOrder);
router.get("/user", verifyToken, getUserOrders);

// ADMIN
router.get("/admin", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
