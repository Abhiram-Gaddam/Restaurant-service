const express = require("express");
const router = express.Router();
const {
  generateBillForOrder,
  getBillByOrder,
  markBillPaid
} = require("../controllers/billController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ADMIN or CASHIER-ROLE (using admin for now)
router.post("/:orderId", verifyToken, isAdmin, generateBillForOrder);
router.get("/order/:orderId", verifyToken, isAdmin, getBillByOrder);
router.put("/:id/pay", verifyToken, isAdmin, markBillPaid);

module.exports = router;
