const PreBooking = require("../models/PreBooking");
const Table = require("../models/Table");


function timeToMinutes(timeStr) {
  const [time, meridian] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}


// USER CREATES PREBOOKING
// exports.createPreBooking = async (req, res) => {
//   try {
    
//     const { table, date, time } = req.body;
//     const existingBooking = await PreBooking.findOne({
//         table,
//         date,
//         time,
//         status: { $ne: "cancelled" },
//         isActive: true
//       });
  
//       if (existingBooking) {
//         return res.status(400).json({
//           message: "This table is already booked for the selected time"
//         });
//       }
//     const preBooking = await PreBooking.create({
//       user: req.user.id,
//       table,
//       date,
//       time
//     });

//     res.status(201).json(preBooking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createPreBooking = async (req, res) => {
  try {
    const { table, date, time } = req.body;

    const start = timeToMinutes(time);
    const end = start + 60; // 1 hour slot

    const existing = await PreBooking.find({
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

    const booking = await PreBooking.create({
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

    if (status === "cancelled") {
        await preBooking.findByIdAndUpdate(req.params.id, { isActive: false });
      
        await Table.findByIdAndUpdate(preBooking.table, {
          status: "available"
        });
      }
      

    res.json(preBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
