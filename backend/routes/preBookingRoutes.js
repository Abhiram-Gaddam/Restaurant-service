const express = require("express");
const router = express.Router();
const {
  createPreBooking,
  getUserPreBookings,
  getAllPreBookings,
  updatePreBookingStatus
} = require("../controllers/preBookingController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// USER
router.post("/", verifyToken, createPreBooking);
router.get("/user", verifyToken, getUserPreBookings);

// ADMIN
router.get("/admin", verifyToken, isAdmin, getAllPreBookings);
router.put("/:id/status", verifyToken, isAdmin, updatePreBookingStatus);

module.exports = router;
