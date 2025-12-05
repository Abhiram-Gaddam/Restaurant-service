const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createBooking);
router.get("/user", verifyToken, getUserBookings);
router.get("/admin", verifyToken, isAdmin, getAllBookings);
router.put("/:id/status", verifyToken, isAdmin, updateBookingStatus);

module.exports = router;
