const Booking = require("../models/Booking");
const Table = require("../models/Table");

// USER CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { table, date, time } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      table,
      date,
      time
    });

    await Table.findByIdAndUpdate(table, { status: "booked" });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("table");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user","-password")
      .populate("table");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (status === "cancelled") {
      await Table.findByIdAndUpdate(booking.table, { status: "available" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
