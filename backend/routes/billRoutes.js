const express = require("express");
const router = express.Router();
const {
  generateBillForOrder,
  getBillByOrder,
  markBillPaid,
  getUserBills,
  getAllBills
} = require("../controllers/billController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/order/:orderId", verifyToken, isAdmin, generateBillForOrder);
router.get("/order/:orderId", verifyToken, getBillByOrder);
router.get("/user", verifyToken, getUserBills);
router.get("/admin", verifyToken, isAdmin, getAllBills);
router.put("/:id/pay", verifyToken, isAdmin, markBillPaid);

module.exports = router;