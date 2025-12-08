const Booking = require("../models/Booking");
const Table = require("../models/Table");

function timeToMinutes(timeStr) {
  const [time, meridian] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}



// USER CREATE BOOKING
// exports.createBooking = async (req, res) => {
//   try {

//     const { table, date, time } = req.body;

//     // ✅ CONFLICT CHECK
//     const existingBooking = await Booking.findOne({
//       table,
//       date,
//       time,
//       status: { $ne: "cancelled" },
//       isActive: true
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This table is already booked for the selected time"
//       });
//     }


 
//     const booking = await Booking.create({
//       user: req.user.id,
//       table,
//       date,
//       time
//     });

//     await Table.findByIdAndUpdate(table, { status: "booked" });

//     res.status(201).json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createBooking = async (req, res) => {
  try {
    const { table, date, time } = req.body;

    const start = timeToMinutes(time);
    const end = start + 60; // 1 hour slot

    const existing = await Booking.find({
      table,
      date,
      status: { $ne: "cancelled" },
      isActive: true
    });

    for (const b of existing) {
      const bStart = timeToMinutes(b.time);
      const bEnd = bStart + 60;

      const overlap = !(end <= bStart || start >= bEnd);
      if (overlap) {
        return res.status(400).json({
          message: "This table is already booked during this time slot"
        });
      }
    }

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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
  
      const query = { isActive: true };
      if (status) query.status = status;
  
      const bookings = await Booking.find(query)
        .populate("user", "-password")
        .populate("table")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      const total = await Booking.countDocuments(query);
  
      res.json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        bookings
      });
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
  await Booking.findByIdAndUpdate(req.params.id, { isActive: false });

  await Table.findByIdAndUpdate(booking.table, {
    status: "available"
  });
}


    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
