const PreBooking = require("../models/PreBooking");
const Table = require("../models/Table");

// USER CREATES PREBOOKING
exports.createPreBooking = async (req, res) => {
  try {
    const { table, date, time } = req.body;

    const preBooking = await PreBooking.create({
      user: req.user.id,
      table,
      date,
      time
    });

    res.status(201).json(preBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER VIEWS OWN PREBOOKINGS
exports.getUserPreBookings = async (req, res) => {
  try {
    const preBookings = await PreBooking.find({ user: req.user.id })
      .populate("table");

    res.json(preBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN VIEWS ALL PREBOOKINGS
exports.getAllPreBookings = async (req, res) => {
  try {
    const preBookings = await PreBooking.find()
      .populate("user","-password")
      .populate("table");

    res.json(preBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN APPROVES / REJECTS PREBOOKING
exports.updatePreBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const preBooking = await PreBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // If approved, convert it into real booking for that date
    if (status === "approved") {
      await Table.findByIdAndUpdate(preBooking.table, {
        status: "booked"
      });
    }

    res.json(preBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
