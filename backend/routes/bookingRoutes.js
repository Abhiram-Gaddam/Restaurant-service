const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingById,
  cancelUserBooking
} = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createBooking);
router.get("/user", verifyToken, getUserBookings);
router.get("/admin", verifyToken, isAdmin, getAllBookings);
router.get("/:id",  getBookingById);
router.put("/:id/cancel", verifyToken, cancelUserBooking);
router.put("/:id/status", verifyToken, isAdmin, updateBookingStatus);

module.exports = router;